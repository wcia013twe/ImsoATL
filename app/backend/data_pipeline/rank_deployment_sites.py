"""
Rank Census Tracts for WiFi Deployment Impact

This module calculates deployment priority scores based on:
- Population (more people = higher impact)
- Poverty rate (higher poverty = higher need)
- Median income (lower income = higher need)
- Coverage gap (lower coverage = higher need)

Formula:
  Impact Score = (Population Weight × Pop) +
                 (Poverty Weight × Poverty Rate) +
                 (Income Weight × Income Score)
"""

import pandas as pd
import requests
import json
from pathlib import Path
from typing import Dict, List, Optional
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DeploymentSiteRanker:
    """Rank census tracts for WiFi deployment impact"""

    def __init__(self, census_api_key: Optional[str] = None):
        self.census_api_key = census_api_key or os.getenv('CENSUS_API_KEY')
        self.census_base_url = "https://api.census.gov/data/2021/acs/acs5"

        # Scoring weights (sum to 100)
        self.weights = {
            'population': 40,      # 40% weight on total population
            'poverty': 40,         # 40% weight on poverty rate
            'income': 20,          # 20% weight on median income
        }

    def fetch_census_demographics(self, geoids: List[str]) -> pd.DataFrame:
        """
        Fetch census demographic data for given GEOIDs

        Args:
            geoids: List of 11-digit census tract GEOIDs

        Returns:
            DataFrame with demographics by GEOID
        """
        logger.info(f"Fetching census demographics for {len(geoids)} tracts...")

        # Extract unique state + county combinations for efficient API calls
        state_counties = set()
        for geoid in geoids:
            state = geoid[:2]
            county = geoid[2:5]
            state_counties.add((state, county))

        all_demographics = []

        for state, county in state_counties:
            logger.info(f"  Fetching State {state}, County {county}...")

            # Census API variables:
            # B01003_001E: Total population
            # B19013_001E: Median household income
            # B17001_002E: Population below poverty level
            # B17001_001E: Total population for poverty calculation
            # B28002_013E: No Internet access (households)
            # B28002_001E: Total households

            variables = [
                'NAME',
                'B01003_001E',  # Total population
                'B19013_001E',  # Median household income
                'B17001_002E',  # Below poverty
                'B17001_001E',  # Total for poverty calc
                'B28002_013E',  # No internet households
                'B28002_001E',  # Total households
            ]

            params = {
                'get': ','.join(variables),
                'for': 'tract:*',
                'in': f'state:{state} county:{county}'
            }

            if self.census_api_key:
                params['key'] = self.census_api_key

            try:
                response = requests.get(self.census_base_url, params=params, timeout=30)
                response.raise_for_status()
                data = response.json()

                # Convert to DataFrame
                headers = data[0]
                rows = data[1:]
                df = pd.DataFrame(rows, columns=headers)

                # Create GEOID
                df['GEOID'] = df['state'] + df['county'] + df['tract']

                all_demographics.append(df)

            except Exception as e:
                logger.warning(f"  Error fetching {state}-{county}: {e}")
                continue

        if not all_demographics:
            logger.error("Failed to fetch any census data")
            return pd.DataFrame()

        # Combine all data
        combined = pd.concat(all_demographics, ignore_index=True)

        # Rename columns
        combined = combined.rename(columns={
            'B01003_001E': 'population',
            'B19013_001E': 'median_income',
            'B17001_002E': 'poverty_count',
            'B17001_001E': 'poverty_total',
            'B28002_013E': 'no_internet_households',
            'B28002_001E': 'total_households',
        })

        # Convert to numeric
        numeric_cols = ['population', 'median_income', 'poverty_count',
                        'poverty_total', 'no_internet_households', 'total_households']
        for col in numeric_cols:
            combined[col] = pd.to_numeric(combined[col], errors='coerce')

        # Calculate rates
        combined['poverty_rate'] = (
            (combined['poverty_count'] / combined['poverty_total'] * 100)
            .fillna(0)
            .clip(0, 100)
        )

        combined['no_internet_pct'] = (
            (combined['no_internet_households'] / combined['total_households'] * 100)
            .fillna(0)
            .clip(0, 100)
        )

        # Select final columns
        result = combined[[
            'GEOID', 'NAME', 'population', 'median_income',
            'poverty_rate', 'no_internet_pct'
        ]]

        logger.info(f"  ✓ Fetched demographics for {len(result)} tracts\n")
        return result

    def calculate_impact_scores(self,
                                  underserved_df: pd.DataFrame,
                                  demographics_df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculate deployment impact scores

        Args:
            underserved_df: DataFrame with underserved tracts + coverage
            demographics_df: DataFrame with census demographics

        Returns:
            DataFrame with impact scores and rankings
        """
        logger.info("Calculating deployment impact scores...")

        # Ensure geoid is string in both dataframes
        underserved_df['geoid'] = underserved_df['geoid'].astype(str).str.replace('.0', '', regex=False)

        # Check if underserved_df already has demographic data
        has_demographics = all(col in underserved_df.columns for col in ['population', 'median_income', 'poverty_rate'])

        if has_demographics:
            # Demographics already in underserved_df, no need to merge
            logger.info("  Using demographics from underserved tracts data")
            merged = underserved_df.copy()
        else:
            # Merge with demographics from CSV
            logger.info("  Merging demographics from coverage CSV")
            demographics_df['GEOID'] = demographics_df['GEOID'].astype(str)
            merged = underserved_df.merge(
                demographics_df,
                left_on='geoid',
                right_on='GEOID',
                how='left'
            )

        # Handle missing data
        merged['population'] = merged['population'].fillna(0)
        merged['poverty_rate'] = merged['poverty_rate'].fillna(0)
        merged['median_income'] = merged['median_income'].fillna(50000)
        merged['total_households'] = merged['total_households'].fillna(0)
        merged['no_internet_households'] = merged['no_internet_households'].fillna(0)
        merged['no_internet_pct'] = merged['no_internet_pct'].fillna(0)

        # Normalize scores to 0-100 scale

        # Population score (normalize by max)
        max_pop = merged['population'].max()
        merged['population_score'] = (merged['population'] / max_pop * 100).clip(0, 100)

        # Poverty score (already 0-100 percentage)
        merged['poverty_score'] = merged['poverty_rate'].clip(0, 100)

        # Income score (inverse - lower income = higher score)
        # Normalize to 0-100 where lower income = higher score
        max_income = merged['median_income'].max()
        min_income = merged['median_income'].min()
        merged['income_score'] = (
            ((max_income - merged['median_income']) / (max_income - min_income) * 100)
            .fillna(0)
            .clip(0, 100)
        )

        # Calculate weighted impact score
        merged['impact_score'] = (
            (merged['population_score'] * self.weights['population'] / 100) +
            (merged['poverty_score'] * self.weights['poverty'] / 100) +
            (merged['income_score'] * self.weights['income'] / 100)
        )

        # Rank by impact score
        merged = merged.sort_values('impact_score', ascending=False)
        merged['deployment_rank'] = range(1, len(merged) + 1)

        # Assign deployment tier
        merged['deployment_tier'] = merged['deployment_rank'].apply(
            lambda x: 'tier_1_critical' if x <= 10
                 else 'tier_2_high' if x <= 25
                 else 'tier_3_medium' if x <= 40
                 else 'tier_4_low'
        )

        logger.info(f"  ✓ Calculated impact scores for {len(merged)} tracts")
        logger.info(f"  Score range: {merged['impact_score'].min():.1f} - {merged['impact_score'].max():.1f}\n")

        return merged

    def export_ranked_sites(self,
                            ranked_df: pd.DataFrame,
                            output_path: Path) -> Dict:
        """
        Export ranked deployment sites to JSON

        Args:
            ranked_df: DataFrame with ranked tracts
            output_path: Path to save JSON

        Returns:
            Dictionary with ranked sites
        """
        logger.info("Exporting ranked deployment sites...")

        # Select key columns
        export_cols = [
            'geoid', 'deployment_rank', 'deployment_tier',
            'impact_score', 'population', 'poverty_rate', 'median_income',
            'coverage_percent', 'total_assets',
            'schools', 'libraries', 'community_centers', 'transit_stops',
            'total_households', 'no_internet_households', 'no_internet_pct'
        ]

        # Convert to list of dicts
        sites = []
        for _, row in ranked_df.iterrows():
            site = {col: row.get(col) for col in export_cols if col in row}

            # Format numbers
            if 'impact_score' in site:
                site['impact_score'] = round(float(site['impact_score']), 1)
            if 'poverty_rate' in site:
                site['poverty_rate'] = round(float(site['poverty_rate']), 1)
            if 'median_income' in site:
                site['median_income'] = int(site['median_income'])
            if 'coverage_percent' in site:
                site['coverage_percent'] = round(float(site['coverage_percent']), 1)

            sites.append(site)

        # Create export object
        export_data = {
            'generated_at': pd.Timestamp.now().isoformat(),
            'total_sites': len(sites),
            'methodology': {
                'weights': self.weights,
                'description': 'Impact score based on population, poverty, income, and coverage gap'
            },
            'tiers': {
                'tier_1_critical': f"Top 10 sites (ranks 1-10)",
                'tier_2_high': f"High priority (ranks 11-25)",
                'tier_3_medium': f"Medium priority (ranks 26-40)",
                'tier_4_low': f"Lower priority (ranks 41+)"
            },
            'sites': sites
        }

        # Save to file
        with open(output_path, 'w') as f:
            json.dump(export_data, f, indent=2)

        logger.info(f"  ✓ Saved to {output_path}\n")
        return export_data


def main():
    """Run deployment site ranking pipeline"""
    logger.info("=" * 70)
    logger.info("WiFi Deployment Site Ranking")
    logger.info("=" * 70)

    project_root = Path(__file__).parent.parent.parent.parent

    # Input files
    coverage_csv = project_root / "florida_tract_coverage.csv"
    underserved_file = project_root / "app/frontend/public/data/processed/underserved_tracts.json"

    # Output files
    ranked_file = project_root / "app/frontend/public/data/processed/ranked_deployment_sites.json"

    # Load underserved tracts
    logger.info("Loading underserved tracts...")
    with open(underserved_file, 'r') as f:
        underserved_data = json.load(f)

    underserved_df = pd.DataFrame(underserved_data['tracts'])
    logger.info(f"  ✓ Loaded {len(underserved_df)} underserved tracts\n")

    # Load demographics from existing CSV (already has pop, income, poverty!)
    logger.info("Loading demographics from coverage CSV...")
    coverage_df = pd.read_csv(coverage_csv)

    # Select demographic columns
    demographics_df = coverage_df[['GEOID', 'population', 'median_income', 'poverty_rate']].copy()
    demographics_df['GEOID'] = demographics_df['GEOID'].astype(str)
    logger.info(f"  ✓ Loaded demographics for {len(demographics_df)} tracts\n")

    # Initialize ranker (no API calls needed!)
    ranker = DeploymentSiteRanker()

    # Calculate impact scores
    ranked_df = ranker.calculate_impact_scores(underserved_df, demographics_df)

    # Export ranked sites
    export_data = ranker.export_ranked_sites(ranked_df, ranked_file)

    # Print summary
    logger.info("=" * 70)
    logger.info("DEPLOYMENT SITE RANKINGS")
    logger.info("=" * 70)

    logger.info("\nTop 10 Critical Sites for Deployment:\n")
    top_10 = ranked_df.head(10)
    for idx, row in top_10.iterrows():
        logger.info(
            f"  #{int(row['deployment_rank']):2d}. GEOID {row['geoid']}: "
            f"Impact {row['impact_score']:.1f} | "
            f"Pop {int(row['population']):,} | "
            f"Poverty {row['poverty_rate']:.1f}% | "
            f"Income ${int(row['median_income']):,}"
        )

    logger.info(f"\n{'=' * 70}")
    logger.info(f"✅ Complete! Ranked {len(ranked_df)} deployment sites")
    logger.info(f"Output: {ranked_file}")
    logger.info("=" * 70)


if __name__ == "__main__":
    main()

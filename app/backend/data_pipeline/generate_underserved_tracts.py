"""
Generate underserved_tracts.json from coverage CSV

This script reads florida_tract_coverage.csv and creates the underserved_tracts.json
file needed by fetch_tract_geometry.py. It filters tracts based on coverage and
population thresholds.
"""

import json
import logging
from pathlib import Path
import pandas as pd

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def generate_underserved_tracts(
    coverage_csv_path: Path,
    output_path: Path,
    coverage_threshold: float = 100.0,
    population_threshold: int = 500
) -> dict:
    """
    Generate underserved tracts JSON from coverage CSV

    Args:
        coverage_csv_path: Path to florida_tract_coverage.csv
        output_path: Path to save underserved_tracts.json
        coverage_threshold: Maximum coverage % to include (default: 100.0, i.e., < 100%)
        population_threshold: Minimum population to include (default: 500)

    Returns:
        Dictionary containing underserved tracts data
    """
    logger.info("=" * 70)
    logger.info("Generating Underserved Tracts from Coverage Data")
    logger.info("=" * 70)

    # Load coverage CSV
    logger.info(f"\n[1/3] Loading coverage data from {coverage_csv_path}")
    df = pd.read_csv(coverage_csv_path)
    logger.info(f"  Loaded {len(df)} total tracts")

    # Apply filters
    logger.info(f"\n[2/3] Filtering tracts...")
    logger.info(f"  Coverage threshold: < {coverage_threshold}%")
    logger.info(f"  Population threshold: > {population_threshold}")

    df_filtered = df[df['coverage'] < coverage_threshold].copy()
    logger.info(f"  After coverage filter: {len(df_filtered)} tracts")

    df_filtered = df_filtered[df_filtered['population'] > population_threshold].copy()
    logger.info(f"  After population filter: {len(df_filtered)} tracts")

    # Build tracts list
    tracts = []
    for _, row in df_filtered.iterrows():
        tract = {
            'geoid': str(row['GEOID']),
            'coverage_percent': float(row['coverage']),
            'population': int(row['population']) if pd.notna(row['population']) else 0,
            'median_income': int(row['median_income']) if pd.notna(row['median_income']) else 0,
            'poverty_rate': float(row['poverty_rate']) if pd.notna(row['poverty_rate']) else 0,
            'census_name': str(row['census_name']) if 'census_name' in row else ''
        }

        # Add asset counts (using the asset types the pipeline expects)
        asset_types = ['schools', 'libraries', 'community_centers', 'transit_stops']
        for asset_type in asset_types:
            col_name = f'asset_count_{asset_type}'
            if col_name in row:
                tract[asset_type] = int(row[col_name]) if pd.notna(row[col_name]) else 0
            else:
                tract[asset_type] = 0

        tract['total_assets'] = sum(tract.get(at, 0) for at in asset_types)
        tracts.append(tract)

    # Create output structure
    output_data = {
        'metadata': {
            'total_tracts': len(tracts),
            'coverage_threshold': coverage_threshold,
            'population_threshold': population_threshold,
            'source': 'florida_tract_coverage.csv',
            'description': 'Census tracts with coverage < 100% and population > 500'
        },
        'tracts': tracts
    }

    # Save to file
    logger.info(f"\n[3/3] Saving to {output_path}")
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w') as f:
        json.dump(output_data, f, indent=2)

    logger.info(f"  ✓ Saved {len(tracts)} underserved tracts")

    logger.info("\n" + "=" * 70)
    logger.info(f"✅ Complete! Generated {len(tracts)} underserved tracts")
    logger.info(f"Output: {output_path}")
    logger.info("=" * 70)

    return output_data


def main():
    """Main execution"""
    project_root = Path(__file__).parent.parent.parent.parent

    # Input and output paths
    coverage_csv = project_root / "florida_tract_coverage.csv"
    output_file = project_root / "app/frontend/public/data/processed/underserved_tracts.json"

    if not coverage_csv.exists():
        logger.error(f"Coverage CSV not found: {coverage_csv}")
        return 1

    # Generate underserved tracts
    generate_underserved_tracts(coverage_csv, output_file)

    logger.info("\nNext steps:")
    logger.info("1. Run: python fetch_tract_geometry.py")
    logger.info("2. This will generate underserved_tracts_geo.json with tract geometries")

    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())

"""
Census ACS Data Client
Fetches demographic data from US Census Bureau API
"""
from typing import Dict, List
from census import Census

ACS_YEAR = 2020  # Latest ACS 5-year release with tract geography support


class CensusClient:
    """Client for fetching Census ACS (American Community Survey) data."""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.census = Census(api_key)
        self.base_url = "https://api.census.gov/data"

    def get_poverty_data(
        self, state_fips: str = "13", year: int = ACS_YEAR
    ) -> List[Dict]:
        """
        Fetch poverty rate data for census tracts in a state

        Args:
            state_fips: State FIPS code (default: "13" for Georgia)

        Returns:
            List of dicts with tract poverty data
        """
        try:
            # ACS 5-Year estimates for poverty
            # B17001_002E: Below poverty level
            # B17001_001E: Total population for poverty determination
            data = self.census.acs5.state_county_tract(
                fields=('NAME', 'B17001_002E', 'B17001_001E'),
                state_fips=state_fips,
                county_fips=Census.ALL,
                tract=Census.ALL,
                year=year
            )

            results = []
            for tract in data:
                try:
                    below_poverty = float(tract.get('B17001_002E', 0) or 0)
                    total_pop = float(tract.get('B17001_001E', 1) or 1)
                    poverty_rate = (below_poverty / total_pop) * 100 if total_pop > 0 else 0

                    results.append({
                        'state': tract.get('state'),
                        'county': tract.get('county'),
                        'tract': tract.get('tract'),
                        'name': tract.get('NAME'),
                        'poverty_rate': round(poverty_rate, 2),
                        'below_poverty_count': int(below_poverty),
                        'total_population': int(total_pop)
                    })
                except (ValueError, TypeError):
                    continue

            return results

        except Exception as e:
            print(f"Error fetching poverty data: {e}")
            return []

    def get_internet_access_data(
        self, state_fips: str = "13", year: int = ACS_YEAR
    ) -> List[Dict]:
        """
        Fetch internet access data for census tracts

        Args:
            state_fips: State FIPS code (default: "13" for Georgia)

        Returns:
            List of dicts with tract internet access data
        """
        try:
            # ACS 5-Year estimates for internet access
            # B28002_013E: No internet access
            # B28002_001E: Total households
            data = self.census.acs5.state_county_tract(
                fields=('NAME', 'B28002_013E', 'B28002_001E'),
                state_fips=state_fips,
                county_fips=Census.ALL,
                tract=Census.ALL,
                year=year
            )

            results = []
            for tract in data:
                try:
                    no_internet = float(tract.get('B28002_013E', 0) or 0)
                    total_households = float(tract.get('B28002_001E', 1) or 1)
                    no_internet_pct = (no_internet / total_households) * 100 if total_households > 0 else 0

                    results.append({
                        'state': tract.get('state'),
                        'county': tract.get('county'),
                        'tract': tract.get('tract'),
                        'name': tract.get('NAME'),
                        'no_internet_pct': round(no_internet_pct, 2),
                        'no_internet_count': int(no_internet),
                        'total_households': int(total_households)
                    })
                except (ValueError, TypeError):
                    continue

            return results

        except Exception as e:
            print(f"Error fetching internet access data: {e}")
            return []

    def get_student_population_data(
        self, state_fips: str = "13", year: int = ACS_YEAR
    ) -> List[Dict]:
        """
        Fetch school-age population data for census tracts

        Args:
            state_fips: State FIPS code (default: "13" for Georgia)

        Returns:
            List of dicts with student population data
        """
        try:
            # ACS 5-Year estimates for school enrollment
            # B14001_002E: Enrolled in school (Total)
            # B01001_001E: Total population
            data = self.census.acs5.state_county_tract(
                fields=('NAME', 'B14001_002E', 'B01001_001E'),
                state_fips=state_fips,
                county_fips=Census.ALL,
                tract=Census.ALL,
                year=year
            )

            results = []
            for tract in data:
                try:
                    enrolled = float(tract.get('B14001_002E', 0) or 0)
                    total_pop = float(tract.get('B01001_001E', 1) or 1)
                    student_pct = (enrolled / total_pop) * 100 if total_pop > 0 else 0

                    results.append({
                        'state': tract.get('state'),
                        'county': tract.get('county'),
                        'tract': tract.get('tract'),
                        'name': tract.get('NAME'),
                        'student_pct': round(student_pct, 2),
                        'enrolled_count': int(enrolled),
                        'total_population': int(total_pop)
                    })
                except (ValueError, TypeError):
                    continue

            return results

        except Exception as e:
            print(f"Error fetching student population data: {e}")
            return []

    def get_combined_data(
        self, state_fips: str = "13", year: int = ACS_YEAR
    ) -> List[Dict]:
        """
        Fetch and combine all relevant demographic data

        Args:
            state_fips: State FIPS code (default: "13" for Georgia)

        Returns:
            List of dicts with combined tract data
        """
        poverty_data = self.get_poverty_data(state_fips, year=year)
        internet_data = self.get_internet_access_data(state_fips, year=year)
        student_data = self.get_student_population_data(state_fips, year=year)

        # Merge data by tract ID
        combined = {}

        for tract in poverty_data:
            tract_id = f"{tract['state']}{tract['county']}{tract['tract']}"
            combined[tract_id] = tract

        for tract in internet_data:
            tract_id = f"{tract['state']}{tract['county']}{tract['tract']}"
            if tract_id in combined:
                combined[tract_id]['no_internet_pct'] = tract['no_internet_pct']
                combined[tract_id]['no_internet_count'] = tract['no_internet_count']

        for tract in student_data:
            tract_id = f"{tract['state']}{tract['county']}{tract['tract']}"
            if tract_id in combined:
                combined[tract_id]['student_pct'] = tract['student_pct']
                combined[tract_id]['enrolled_count'] = tract['enrolled_count']

        return list(combined.values())

import pandas as pd


class ScoringTool:
    """Tool to score census tracts based on demographic data."""

    def __init__(self, census_data: pd.DataFrame):
        self.census_data = census_data

    def run(self):
        """
        Scores census tracts based on a combination of poverty, internet access,
        and student population. Returns a list of the top 20% of tracts.
        """
        # Simple scoring for now, can be replaced with a more complex model
        self.census_data["score"] = (
            self.census_data["poverty_rate"] * 0.5
            + (1 - self.census_data["internet_access"]) * 0.3
            + self.census_data["student_rate"] * 0.2
        )

        top_tracts = self.census_data.sort_values(by="score", ascending=False).head(
            int(len(self.census_data) * 0.2)
        )

        return top_tracts["GEOID"].tolist()

import os
from google.generativeai import GenerativeAI

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def parse_query(text: str) -> dict:
    """
    Takes user natural language query and returns structured project constraints using Gemini.

    Args:
        text: User's natural language query about WiFi deployment

    Returns:
        Dictionary with extracted fields including state_fips for location
    """
    prompt = (
        f"""
        You are an expert data extraction agent for smart WiFi deployment.
        Given this goal: '{text}', extract and return a JSON object with these fields:
        - target_population (list): demographic groups to prioritize
        - priority_metrics (list): metrics to optimize for
        - asset_types (list): types of community assets to consider
        - anchor_proximity (list): anchor institutions to be near
        - geography (string): the location/area mentioned (e.g., "Atlanta, Georgia")
        - state (string): the US state name (e.g., "Georgia")
        - state_fips (string): two-digit FIPS code for the state (e.g., "13" for Georgia)
        - coverage_threshold (number): if mentioned, the coverage % threshold (0-100), otherwise null

        Important: Use standard US state FIPS codes (01=Alabama, 13=Georgia, 48=Texas, etc.)

        Only return valid JSON, no explanation or markdown.

        Example for "Find underserved areas in Atlanta, GA":
        {{
          "target_population": ["low-income", "underserved"],
          "priority_metrics": ["coverage_gap", "population_density"],
          "asset_types": ["schools", "libraries", "community_centers"],
          "anchor_proximity": [],
          "geography": "Atlanta, Georgia",
          "state": "Georgia",
          "state_fips": "13",
          "coverage_threshold": null
        }}
        """
    )
    genai = GenerativeAI(api_key=GEMINI_API_KEY)
    response = genai.completions.create(prompt=prompt, model="gemini-pro")
    try:
        # Extract and parse JSON from the model response safely
        import json
        result = json.loads(response.text)
        return result
    except Exception as e:
        # Fallback: simple template or error handling
        return {"error": str(e)}
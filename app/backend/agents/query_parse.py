import os
from google.generativeai import GenerativeAI

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def parse_query(text: str) -> dict:
    """
    Takes user natural language query and returns structured project constraints using Gemini.
    """
    prompt = (
        f"""
        You are an expert data extraction agent for smart WiFi deployment. 
        Given this goal: '{text}', extract and return a JSON object with these fields:
        - target_population (list)
        - priority_metrics (list)
        - asset_types (list)
        - anchor_proximity (list)
        - geography (string)
        Only return JSON, no explanation.
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
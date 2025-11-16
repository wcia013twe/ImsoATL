"""
Simulation router for WiFi deployment persona generation.
"""

import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional

from agents.persona_generator import PersonaGenerator


router = APIRouter(prefix="/api/simulation", tags=["simulation"])


# Request model
class SimulateRequest(BaseModel):
    tract_id: str
    county: str
    poverty_rate: float
    total_population: int
    no_internet_pct: float
    median_income: Optional[float] = 35000
    student_population: Optional[int] = None


# Initialize persona generator
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY environment variable is required")

persona_generator = PersonaGenerator(gemini_api_key=gemini_api_key)


@router.post("/personas")
async def simulate_personas(request: SimulateRequest) -> Dict[str, Any]:
    """
    Generate 5 detailed personas representing residents who would benefit
    from WiFi deployment at the given site.

    Args:
        request: Site demographic data

    Returns:
        Dictionary containing 5 personas and summary
    """
    try:
        # Convert request to dict for persona generator
        site_data = {
            'tract_id': request.tract_id,
            'county': request.county,
            'poverty_rate': request.poverty_rate,
            'total_population': request.total_population,
            'no_internet_pct': request.no_internet_pct,
            'median_income': request.median_income,
            'student_population': request.student_population
        }

        # Generate personas
        result = await persona_generator.generate_personas(site_data, num_personas=5)

        return {
            "status": "success",
            "data": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate personas: {str(e)}"
        )

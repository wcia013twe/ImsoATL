"""
Deployment Pipeline API Router

Endpoints for running deployment site analysis and ranking
"""

from fastapi import APIRouter, HTTPException
import sys
import os
from pathlib import Path

router = APIRouter(
    prefix="/api/deployment",
    tags=["deployment"],
    responses={404: {"description": "Not found"}},
)


@router.post("/run-pipeline/{city_slug}")
async def run_deployment_pipeline(city_slug: str):
    """
    Run the complete deployment pipeline for a city and return results

    Args:
        city_slug: City identifier (e.g., 'madison-county-fl')

    Returns:
        JSON containing ranked deployment sites and geometries
    """
    try:
        # Add data_pipeline directory to path
        current_dir = Path(__file__).parent.parent
        pipeline_dir = current_dir / 'data_pipeline'
        if str(pipeline_dir) not in sys.path:
            sys.path.insert(0, str(pipeline_dir))

        from run_pipeline import run_deployment_pipeline

        # Run the pipeline
        result = run_deployment_pipeline(city_slug)

        return {
            "status": "success",
            "city_slug": city_slug,
            "data": result
        }

    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Pipeline execution failed: {str(e)}"
        )

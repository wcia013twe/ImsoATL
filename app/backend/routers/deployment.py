"""
Deployment Pipeline API Router

Endpoints for running deployment site analysis and ranking
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Literal, Optional
import sys
import os
from pathlib import Path

router = APIRouter(
    prefix="/api/deployment",
    tags=["deployment"],
    responses={404: {"description": "Not found"}},
)


class LocationInput(BaseModel):
    """Location information for deployment pipeline"""
    name: str
    type: Literal["state", "city"]
    state: Optional[str] = None  # Required for cities
    slug: str


@router.post("/run-pipeline")
async def run_deployment_pipeline_for_location(location: LocationInput):
    """
    Run the complete deployment pipeline for a state or city

    Args:
        location: Location information (name, type, state, slug)

    Returns:
        JSON containing ranked deployment sites and geometries
    """
    try:
        # Add data_pipeline and services directories to path
        current_dir = Path(__file__).parent.parent
        pipeline_dir = current_dir / 'data_pipeline'
        services_dir = current_dir / 'services'

        if str(pipeline_dir) not in sys.path:
            sys.path.insert(0, str(pipeline_dir))
        if str(services_dir) not in sys.path:
            sys.path.insert(0, str(services_dir))

        from run_pipeline import run_deployment_pipeline_with_location

        # Run the pipeline with location information
        result = run_deployment_pipeline_with_location(
            location_name=location.name,
            location_type=location.type,
            state_name=location.state,
            slug=location.slug
        )

        return {
            "status": "success",
            "location": {
                "name": location.name,
                "type": location.type,
                "slug": location.slug
            },
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

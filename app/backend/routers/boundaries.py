"""
Boundary API Router

Endpoints for fetching state, county, and census tract boundaries
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import sys
import os
from pathlib import Path

# Add services directory to path
current_dir = Path(__file__).parent.parent
services_dir = current_dir / 'services'
if str(services_dir) not in sys.path:
    sys.path.insert(0, str(services_dir))

from tiger_api import TIGERAPIService

router = APIRouter(
    prefix="/api/boundaries",
    tags=["boundaries"],
    responses={404: {"description": "Not found"}},
)

# Initialize TIGER API service
tiger_service = TIGERAPIService()


@router.get("/state/{state_name}")
async def get_state_boundary(state_name: str):
    """
    Fetch state boundary from Census TIGER API

    Args:
        state_name: State name (e.g., "Florida", "Georgia")

    Returns:
        GeoJSON feature with state boundary
    """
    boundary = tiger_service.fetch_state_boundary(state_name)

    if not boundary:
        raise HTTPException(
            status_code=404,
            detail=f"State boundary not found for {state_name}"
        )

    return {
        "status": "success",
        "state": state_name,
        "boundary": boundary
    }


@router.get("/tract/{geoid}")
async def get_tract_boundary(geoid: str):
    """
    Fetch census tract boundary by GEOID

    Args:
        geoid: 11-digit census tract GEOID (e.g., "12079110200")

    Returns:
        GeoJSON feature with tract boundary
    """
    if len(geoid) != 11:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid GEOID format. Expected 11 digits, got {len(geoid)}"
        )

    boundary = tiger_service.fetch_tract_boundary(geoid)

    if not boundary:
        raise HTTPException(
            status_code=404,
            detail=f"Census tract boundary not found for GEOID {geoid}"
        )

    return {
        "status": "success",
        "geoid": geoid,
        "boundary": boundary
    }


@router.get("/tracts/state/{state_name}")
async def list_tracts_in_state(
    state_name: str,
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of tracts to return")
):
    """
    List census tracts in a state

    Args:
        state_name: State name (e.g., "Florida")
        limit: Maximum number of tracts to return (1-1000)

    Returns:
        List of census tract metadata
    """
    tracts = tiger_service.fetch_tracts_in_state(state_name, limit=limit)

    if not tracts:
        raise HTTPException(
            status_code=404,
            detail=f"No census tracts found for {state_name}"
        )

    return {
        "status": "success",
        "state": state_name,
        "count": len(tracts),
        "tracts": tracts
    }


@router.get("/county")
async def get_county_boundary(
    county_name: str = Query(..., description="County name (e.g., 'Madison County')"),
    state_name: str = Query(..., description="State name (e.g., 'Florida')"),
    city_slug: str = Query(..., description="City slug for caching (e.g., 'madison-county-fl')")
):
    """
    Fetch county boundary (legacy endpoint for compatibility)

    Args:
        county_name: County name
        state_name: State name
        city_slug: City slug for caching

    Returns:
        GeoJSON feature with county boundary
    """
    import requests
    import json

    # State FIPS codes
    state_fips_map = tiger_service.STATE_FIPS

    # Cache directory
    cache_dir = Path(current_dir).parent.parent / 'cache' / 'boundaries'
    cache_dir.mkdir(parents=True, exist_ok=True)
    cache_file = cache_dir / f'{city_slug}.json'

    # Check cache first
    if cache_file.exists():
        try:
            with open(cache_file, 'r') as f:
                boundary = json.load(f)
            return {
                "status": "success",
                "city_slug": city_slug,
                "boundary": boundary,
                "source": "cache"
            }
        except Exception:
            pass

    # Try to load from static file (if exists)
    static_file = current_dir.parent / 'frontend' / 'public' / 'data' / 'cities' / f'{city_slug}.json'

    if static_file.exists():
        try:
            with open(static_file, 'r') as f:
                boundary = json.load(f)

            # Cache it
            try:
                with open(cache_file, 'w') as f:
                    json.dump(boundary, f, indent=2)
            except Exception:
                pass

            return {
                "status": "success",
                "city_slug": city_slug,
                "boundary": boundary,
                "source": "static_file"
            }
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to load static file: {str(e)}"
            )

    # Fallback: Try Census TIGER API
    county_clean = county_name.replace(' County', '').replace(' county', '').strip()
    state_fips = state_fips_map.get(state_name, '00')

    try:
        api_url = "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer/82/query"

        params = {
            'where': f"GEOID LIKE '{state_fips}%' AND BASENAME LIKE '%{county_clean}%'",
            'outFields': '*',
            'outSR': '4326',
            'f': 'geojson'
        }

        response = requests.get(api_url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()

        if not data.get('features') or len(data['features']) == 0:
            raise HTTPException(
                status_code=404,
                detail=f"Boundary not found for {county_name}, {state_name}"
            )

        boundary = data['features'][0]

        # Cache the result
        try:
            with open(cache_file, 'w') as f:
                json.dump(boundary, f, indent=2)
        except Exception:
            pass

        return {
            "status": "success",
            "city_slug": city_slug,
            "boundary": boundary,
            "source": "census_tiger"
        }

    except requests.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch boundary from Census API: {str(e)}"
        )

"""
Tract Geometry Tool

Fetches GeoJSON polygons for census tracts using the Census TIGERweb
ArcGIS service so agents can visualize selected tracts on the map.
"""

from __future__ import annotations

import logging
from typing import Dict, List

import httpx


logger = logging.getLogger(__name__)


class TractGeometry:
    """Utility for downloading tract geometries from TIGERweb."""

    BASE_URL = (
        "https://tigerweb.geo.census.gov/arcgis/rest/services/"
        "TIGERweb/Tracts_Blocks/MapServer/3/query"
    )

    def __init__(self, chunk_size: int = 20, request_timeout: int = 30) -> None:
        self.chunk_size = chunk_size
        self.request_timeout = request_timeout

    def fetch_geojson(self, tract_geoids: List[str]) -> Dict:
        """
        Fetch GeoJSON FeatureCollection for the provided tract GEOIDs.

        Args:
            tract_geoids: List of 11-digit tract GEOIDs.

        Returns:
            FeatureCollection dictionary.
        """
        if not tract_geoids:
            return {"type": "FeatureCollection", "features": []}

        unique_ids = sorted(set(tract_geoids))
        features: List[Dict] = []

        with httpx.Client(timeout=self.request_timeout) as client:
            for batch in self._chunk(unique_ids, self.chunk_size):
                where = "GEOID IN ({})".format(
                    ",".join([f"'{geoid}'" for geoid in batch])
                )
                params = {
                    "where": where,
                    "outFields": "GEOID,NAME,STATE,COUNTY",
                    "f": "geojson",
                    "outSR": 4326,
                }

                logger.info(
                    "Requesting tract geometries for %d tracts from TIGERweb", len(batch)
                )
                response = client.get(self.BASE_URL, params=params)
                response.raise_for_status()
                payload = response.json()
                features.extend(payload.get("features", []))

        logger.info("Retrieved %d tract geometries", len(features))
        return {"type": "FeatureCollection", "features": features}

    @staticmethod
    def _chunk(items: List[str], size: int) -> List[List[str]]:
        return [items[i : i + size] for i in range(0, len(items), size)]

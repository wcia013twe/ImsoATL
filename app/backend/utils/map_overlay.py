"""
Map overlay helper.

Builds structured events that instruct the frontend to render GeoJSON layers.
"""
from __future__ import annotations

from typing import Any, Dict, Optional
import uuid


class MapOverlayPublisher:
    """Formats GeoJSON overlays into websocket-friendly events."""

    def __init__(self, default_layer_id: str = "demographic-hotspots") -> None:
        self.default_layer_id = default_layer_id

    def build_overlay_event(
        self,
        feature_collection: Dict[str, Any],
        *,
        layer_id: Optional[str] = None,
        title: Optional[str] = None,
        description: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Create a websocket event instructing the frontend to display GeoJSON.
        """
        return {
            "type": "map_overlay",
            "layer_id": layer_id or self.default_layer_id,
            "overlay_id": str(uuid.uuid4()),
            "title": title or "Highlighted Census Tracts",
            "description": description,
            "geojson": feature_collection,
            "metadata": metadata or {},
        }


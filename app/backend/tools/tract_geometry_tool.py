from app.backend.data_sources.tract_geometry import TractGeometry


class TractGeometryTool:
    """Tool to fetch tract geometry."""

    def __init__(
        self, geoids: list[str], chunk_size: int = 20, request_timeout: int = 30
    ):
        self.geoids = geoids
        self.geometry = TractGeometry(
            chunk_size=chunk_size, request_timeout=request_timeout
        )

    def run(self):
        """Fetches and returns GeoJSON for the specified tract GEOIDs."""
        return self.geometry.fetch_geojson(self.geoids)

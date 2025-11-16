class MapDisplayTool:
    """Tool to format GeoJSON data for the map overlay channel."""

    def __init__(self, geojson_data: dict):
        self.geojson_data = geojson_data

    def run(self):
        """
        In a real application, this would emit an event to the frontend
        (e.g., via WebSockets) to display the data on a map.
        For now, it just returns the data structured as an event.
        """
        return {"event": "map_overlay", "payload": self.geojson_data}

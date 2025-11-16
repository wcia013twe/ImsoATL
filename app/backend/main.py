import os
import sys
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Add current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

app = FastAPI(title="CivicConnect WiFi Assistant API")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",  # In case Next.js is on different port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Register routers
from routers.boundaries import router as boundaries_router
from routers.deployment import router as deployment_router

app.include_router(boundaries_router)
app.include_router(deployment_router)

@app.get("/")
async def root():
    return {"message": "CivicConnect WiFi Assistant API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.websocket("/ws/chat")
async def websocket_chat_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)

            user_message = message_data.get("message", "")
            city = message_data.get("city", "Atlanta")

            # Import orchestrator here to avoid circular imports
            from agents.orchestrator import OrchestratorAgent

            # Create orchestrator instance
            orchestrator = OrchestratorAgent(model="gemini-2.5-flash")

            # Process query and get response
            response = await orchestrator.run(prompt=user_message, city=city)

            # Debug: Log map event data
            if 'map_event' in response:
                features_count = len(response['map_event'].get('payload', {}).get('features', []))
                print(f"DEBUG: Sending map_event with {features_count} tract features")

            # Send the response
            try:
                # Test if response can be serialized
                json_str = json.dumps(response)
                print(f"DEBUG: Response size: {len(json_str)} bytes")
                await websocket.send_json(response)
                print("DEBUG: Response sent successfully")
            except Exception as e:
                print(f"ERROR: Failed to send response: {e}")
                import traceback
                traceback.print_exc()
                error_response = {
                    "type": "error",
                    "message": f"Failed to serialize response: {str(e)}"
                }
                await websocket.send_json(error_response)

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        error_response = {
            "type": "error",
            "message": f"An error occurred: {str(e)}"
        }
        await websocket.send_json(error_response)
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

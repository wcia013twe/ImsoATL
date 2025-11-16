import os
import sys
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Add current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, "..", ".."))

for path in (project_root, current_dir):
    if path not in sys.path:
        sys.path.insert(0, path)

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

app = FastAPI(title="CivicConnect WiFi Assistant API")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
            from app.backend.agents.orchestrator import OrchestratorAgent

            # Create orchestrator instance
            orchestrator = OrchestratorAgent()

            # Process query and get response
            result = await orchestrator.run(prompt=user_message)
            await websocket.send_json(result)

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        error_response = {"type": "error", "message": f"An error occurred: {str(e)}"}
        await websocket.send_json(error_response)
        await websocket.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

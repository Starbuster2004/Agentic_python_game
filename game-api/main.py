from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from agents.npc_agent import NPCAgent
from game.missions import MissionManager
from game.models import ChatMessage


npc_agent: NPCAgent = None
mission_manager: MissionManager = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global npc_agent, mission_manager
    logger.info("🚀 Starting Game API...")
    npc_agent = NPCAgent()
    mission_manager = MissionManager()
    logger.info("✅ Game API ready!")
    yield
    logger.info("👋 Shutting down...")


app = FastAPI(title="My 2D Game API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "alive"}


@app.post("/chat")
async def chat(msg: ChatMessage):
    try:
        response = await npc_agent.chat(
            npc_id=msg.npc_id, player_message=msg.message,
            inventory=mission_manager.get_inventory(),
            missions_completed={k: v.value for k, v in mission_manager.get_missions().items()},
        )
        actions = mission_manager.process_npc_actions(response.give_item, response.mission_complete)
        return {
            "response": response.message, "give_item": response.give_item,
            "mission_complete": response.mission_complete, "game_actions": actions,
            "inventory": mission_manager.get_inventory(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    """Streaming WebSocket — same protocol as PhiloAgents."""
    await websocket.accept()
    logger.info("🔌 Player connected")

    try:
        while True:
            data = await websocket.receive_json()

            if "message" not in data or "npc_id" not in data:
                await websocket.send_json({"error": "Need 'message' and 'npc_id'"})
                continue

            try:
                await websocket.send_json({"streaming": True})

                full_response = ""
                async for chunk in npc_agent.chat_streaming(
                    npc_id=data["npc_id"], player_message=data["message"],
                    inventory=mission_manager.get_inventory(),
                    missions_completed={k: v.value for k, v in mission_manager.get_missions().items()},
                ):
                    full_response += chunk
                    await websocket.send_json({"chunk": chunk})

                give_item = npc_agent._extract_command(full_response, "GIVE_ITEM")
                mission_complete = npc_agent._extract_command(full_response, "MISSION_COMPLETE")
                clean = npc_agent._clean_response(full_response)
                actions = mission_manager.process_npc_actions(give_item, mission_complete)

                await websocket.send_json({
                    "response": clean, "streaming": False,
                    "give_item": give_item, "mission_complete": mission_complete,
                    "game_actions": actions, "inventory": mission_manager.get_inventory(),
                })
            except Exception as e:
                await websocket.send_json({"error": str(e)})

    except WebSocketDisconnect:
        logger.info("🔌 Player disconnected")


@app.post("/reset-memory")
async def reset():
    npc_agent.reset_memory()
    mission_manager.reset()
    return {"status": "reset"}


@app.get("/game-state")
def game_state():
    return {
        "inventory": mission_manager.get_inventory(),
        "missions": {k: v.value for k, v in mission_manager.get_missions().items()},
        "game_complete": mission_manager.is_game_complete(),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
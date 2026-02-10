from pydantic import BaseModel
from typing import List, Optional

class DialogueRequest(BaseModel):
    npc_id: str
    message: str
    player_id: str

class DialogueResponse(BaseModel):
    npc_id: str
    message: str

class GameState(BaseModel):
    player_pos: List[float]
    active_missions: List[str]

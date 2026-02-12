from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum

class NPCDefinition(BaseModel):
    id: str
    name: str
    perspective: str =""
    style: str = ""
    spawn_x: float=0
    spawn_y: float=0
    
class ChatMessage(BaseModel):
    message: str
    npc_id: str
    
class ChatResponse(BaseModel):
    message: str
    give_item: Optional[str] = None
    mission_complete: Optional[str] = None
    npc_id: str

class MissionStatus(Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class PlayerState(BaseModel):
    inventory: List[str]= Field(default_factory=list)
    missions: Dict[str, MissionStatus]= Field(default_factory=dict)

    def has_item(self, item:str) -> bool:
        return item in self.inventory

    def add_item(self, item:str) -> None:
        if item not in self.inventory:
            self.inventory.append(item)

    def complete_mission(self, mission_id:str) -> None:
        self.missions[mission_id] = MissionStatus.COMPLETED

    def is_mission_completed(self, mission_id:str) -> bool:
        return self.missions.get(mission_id) == MissionStatus.COMPLETED


'''class Mission(BaseModel):
    id: str
    title: str
    description: str
    status: MissionStatus = MissionStatus.NOT_STARTED
    reward_item: Optional[str] = None
   ''' 
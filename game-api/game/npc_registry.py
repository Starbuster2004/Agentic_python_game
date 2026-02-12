from game.models import NPCDefinition
from agents.prompts import NPC_CONFIGS


class NPCRegistry:
    def __init__(self):
        self._npcs = {}
        for npc_id, config in NPC_CONFIGS.items():
            self._npcs[npc_id] = NPCDefinition(
                id=npc_id,
                name=config["name"],
                perspective=config["perspective"],
                style=config["style"],
                mission_instructions=config["mission_instructions"]
            )

    def get_npc(self, npc_id: str) -> NPCDefinition:
        if npc_id not in self._npcs:
            raise KeyError(f"NPC with ID '{npc_id}' not found")
        return self._npcs[npc_id]

    def get_all_npcs(self) -> list[NPCDefinition]:
        return list(self._npcs.values())
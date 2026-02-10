from agents.npc_agent import NPCAgent
from agents.prompts import VILLAGER_PROMPT, QUEST_GIVER_PROMPT

class NPCRegistry:
    def __init__(self):
        self.npcs = {
            "villager_1": NPCAgent("Barnaby", VILLAGER_PROMPT),
            "wizard_1": NPCAgent("Eldrin", QUEST_GIVER_PROMPT),
        }

    def get_npc(self, npc_id: str) -> NPCAgent:
        return self.npcs.get(npc_id)

registry = NPCRegistry()

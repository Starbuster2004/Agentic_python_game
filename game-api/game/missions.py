from typing import Optional
from loguru import logger
from game.models import PlayerState, MissionStatus


ALL_MISSIONS = {
    "riddle_quest": MissionStatus.NOT_STARTED,
    "forge_quest": MissionStatus.NOT_STARTED,
    "herb_quest": MissionStatus.NOT_STARTED,
    "guard_quest": MissionStatus.NOT_STARTED,
    "dragon_quest": MissionStatus.NOT_STARTED,
}


class MissionManager:
    def __init__(self):
        self.player_state = PlayerState(
            missions=dict(ALL_MISSIONS)
        )

    def get_inventory(self) -> list[str]:
        return self.player_state.inventory

    def get_missions(self) -> dict[str, MissionStatus]:
        return self.player_state.missions

    def process_npc_actions(self, give_item: Optional[str], mission_complete: Optional[str]) -> dict:
        result = {"items_received": [], "missions_completed": [], "game_complete": False}

        if give_item and not self.player_state.has_item(give_item):
            self.player_state.add_item(give_item)
            result["items_received"].append(give_item)
            logger.info(f"📦 Player got: {give_item}")

        if mission_complete and not self.player_state.is_mission_completed(mission_complete):
            self.player_state.complete_mission(mission_complete)
            result["missions_completed"].append(mission_complete)
            logger.info(f"✅ Mission done: {mission_complete}")

        if self.is_game_complete():
            result["game_complete"] = True
            logger.info("🎉 ALL MISSIONS COMPLETE!")

        return result

    def is_game_complete(self) -> bool:
        return all(s == MissionStatus.COMPLETED for s in self.player_state.missions.values())

    def reset(self) -> None:
        self.player_state = PlayerState(missions=dict(ALL_MISSIONS))
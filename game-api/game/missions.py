class MissionTracker:
    def __init__(self):
        self.missions = {
            "mission_1": {"title": "The First Step", "status": "available"},
            "mission_2": {"title": "The Lost Scroll", "status": "locked"},
        }

    def update_mission(self, mission_id: str, new_status: str):
        if mission_id in self.missions:
            self.missions[mission_id]["status"] = new_status

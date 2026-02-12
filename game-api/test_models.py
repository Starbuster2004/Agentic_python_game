from game.models import PlayerState

player = PlayerState()
player.add_item("magic_key")
print(f"Has key: {player.has_item('magic_key')}")   # True
player.complete_mission("riddle_quest")
print(f"Riddle done: {player.is_mission_completed('riddle_quest')}")  # True
print("✅ Models work!")
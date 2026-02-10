from datetime import datetime

class ConversationMemory:
    def __init__(self):
        self.history = []

    def add_entry(self, role: str, content: str):
        self.history.append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        })

    def get_context(self):
        return self.history[-10:] # Return last 10 messages

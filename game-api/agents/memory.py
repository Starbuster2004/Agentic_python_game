from typing import Optional
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from loguru import logger


class ConversationMemory:
    def __init__(self, max_messages: int = 20):
        self.max_messages = max_messages
        self._histories: dict[str, list[BaseMessage]] = {}
        self._summaries: dict[str, str] = {}

    def get_history(self, npc_id: str) -> list[BaseMessage]:
        return self._histories.get(npc_id, [])

    def get_summary(self, npc_id: str) -> str:
        return self._summaries.get(npc_id, "No previous conversation.")

    def add_message(self, npc_id: str, role: str, content: str) -> None:
        if npc_id not in self._histories:
            self._histories[npc_id] = []

        msg = HumanMessage(content=content) if role == "human" else AIMessage(content=content)
        self._histories[npc_id].append(msg)

        if len(self._histories[npc_id]) > self.max_messages:
            self._trim_history(npc_id)

    def _trim_history(self, npc_id: str) -> None:
        history = self._histories[npc_id]
        split = len(history) // 2
        old = history[:split]

        parts = []
        for msg in old:
            role = "Player" if isinstance(msg, HumanMessage) else "NPC"
            parts.append(f"{role}: {msg.content}")

        old_summary = self._summaries.get(npc_id, "")
        new_summary = old_summary + "\n" + "\n".join(parts)
        if len(new_summary) > 500:
            new_summary = new_summary[-500:]

        self._summaries[npc_id] = new_summary
        self._histories[npc_id] = history[split:]
        logger.info(f"Trimmed {npc_id} history")

    def reset(self, npc_id: Optional[str] = None) -> None:
        if npc_id:
            self._histories.pop(npc_id, None)
            self._summaries.pop(npc_id, None)
        else:
            self._histories.clear()
            self._summaries.clear()
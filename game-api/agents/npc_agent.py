import re
from typing import Optional
from loguru import logger

from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from config import settings
from agents.prompts import build_system_prompt
from agents.memory import ConversationMemory
from game.models import ChatResponse


class NPCAgent:
    def __init__(self):
        self.llm = ChatGroq(
            api_key = settings.GROQ_API_KEY,
            model = settings.LLM_MODEL,
            temperature = settings.LLM_TEMPERATURE,
            max_tokens = settings.LLM_MAX_TOKENS,
        )
        self.memory = ConversationMemory(max_messages = settings.MAX_CONVERSATION_HISTORY)
        logger.info(f"NPC Agent ready model : {settings.LLM_MODEL}")

    async def chat(
        self, npc_id: str, player_message: str,
        inventory: list[str], missions_completed: dict[str, str],
    ) -> ChatResponse:
        summary = self.memory.get_summary(npc_id)
        system_prompt = build_system_prompt(npc_id, inventory, missions_completed, summary)

        messages = [SystemMessage(content=system_prompt)]
        messages.extend(self.memory.get_history(npc_id))
        messages.append(HumanMessage(content=player_message))

        response = await self.llm.ainvoke(messages)
        content = response.content

        self.memory.add_message(npc_id, "human", player_message)
        self.memory.add_message(npc_id, "ai", content)

        return ChatResponse(
            message=self._clean_response(content),
            give_item=self._extract_command(content, "GIVE_ITEM"),
            mission_complete=self._extract_command(content, "MISSION_COMPLETE"),
            npc_id=npc_id
        )

    async def chat_streaming(
        self, npc_id: str, player_message: str,
        inventory: list[str], missions_completed: dict[str, str],
    ):
        summary = self.memory.get_summary(npc_id)
        system_prompt = build_system_prompt(npc_id, inventory, missions_completed, summary)

        messages = [SystemMessage(content=system_prompt)]
        messages.extend(self.memory.get_history(npc_id))
        messages.append(HumanMessage(content=player_message))

        full_response = ""
        try:
            async for chunk in self.llm.astream(messages):
                if chunk.content:
                    full_response += chunk.content
                    yield chunk.content
        except Exception as e:
            logger.error(f"Streaming error: {e}")
            yield "Hmm, my mind seems clouded..."
            full_response = "Hmm, my mind seems clouded..."

        self.memory.add_message(npc_id, "human", player_message)
        self.memory.add_message(npc_id, "ai", full_response)

    def reset_memory(self, npc_id: Optional[str] = None):
        self.memory.reset(npc_id)

    def _extract_command(self, text: str, cmd: str) -> Optional[str]:
        match = re.search(rf'\[{cmd}:(\w+)\]', text)
        return match.group(1) if match else None

    def _clean_response(self, text: str) -> str:
        text = re.sub(r'\[GIVE_ITEM:\w+\]', '', text)
        text = re.sub(r'\[MISSION_COMPLETE:\w+\]', '', text)
        return text.strip()

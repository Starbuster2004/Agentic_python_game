# 🎮 Complete Build Guide: 2D Game with AI NPCs
### A Beginner's Step-by-Step Guide — Python-Heavy, with AI IDE Instructions
### Inspired by [neural-maze/philoagents-course](https://github.com/neural-maze/philoagents-course)

---

## 📋 Table of Contents

| # | Component | Language | Difficulty |
|---|-----------|----------|------------|
| 0 | AI IDE Setup Guide | — | ⭐ |
| 1 | Project Structure & Environment | Both | ⭐ |
| 2 | Python Backend — Config & Settings | Python | ⭐ |
| 3 | Python Backend — NPC Domain Models | Python | ⭐ |
| 4 | Python Backend — NPC Personality Prompts | Python | ⭐⭐ |
| 5 | Python Backend — AI Agent (LLM Brain) | Python | ⭐⭐ |
| 6 | Python Backend — Conversation Memory | Python | ⭐⭐ |
| 7 | Python Backend — Mission System | Python | ⭐⭐ |
| 8 | Python Backend — FastAPI + WebSocket Server | Python | ⭐⭐ |
| 9 | Game Frontend — Phaser 3 Setup | JavaScript | ⭐ |
| 10 | Game Frontend — Map, Player & NPCs | JavaScript | ⭐⭐ |
| 11 | Game Frontend — Dialogue & API Connection | JavaScript | ⭐⭐ |
| 12 | Docker & Running Everything | YAML/Bash | ⭐ |
| 13 | Testing Each Component | Python | ⭐ |

---

## 🏗️ How PhiloAgents Is Architected (What We're Simplifying)

PhiloAgents splits into two apps:

```
philoagents-course/
├─�� philoagents-api/     # Python backend (FastAPI, LangGraph, LangChain, Groq, MongoDB)
│   └── src/philoagents/
│       ├── config.py
│       ├── domain/          # Prompts, philosopher models, exceptions
│       ├── application/     # Agents, RAG, memory, evaluation
│       └── infrastructure/  # FastAPI server, MongoDB, Opik monitoring
└── philoagents-ui/      # JavaScript frontend (Phaser 3, Webpack)
    └── src/
        ├── main.js
        ├── scenes/          # Game.js, MainMenu.js, Preloader.js, PauseMenu.js
        ├── classes/         # Character.js, DialogueBox.js, DialogueManager.js
        └── services/        # ApiService.js, WebSocketApiService.js
```

**Our simplified version keeps the same 2-app pattern but removes MongoDB, LangGraph, RAG, and Opik.**

| PhiloAgents Feature | Their Tool | Our Simpler Version |
|---|---|---|
| LLM calls | LangGraph + LangChain + Groq | LangChain + Groq (direct) |
| NPC memory | MongoDB checkpoints | Python dict in memory |
| Knowledge base | MongoDB vector search + Wikipedia | Hardcoded in prompts |
| Monitoring | Opik + Comet ML | Print/loguru logs |
| API | FastAPI + WebSocket | FastAPI + WebSocket (same) |
| Game engine | Phaser 3 | Phaser 3 (same) |
| Deployment | Docker Compose | Docker Compose (same) |

---

## 🤖 Component 0: AI IDE Setup Guide

### Which AI IDE to Choose

| AI IDE | Best For | Free? |
|--------|---------|-------|
| **Cursor** | Full AI-first IDE, auto-complete + chat + agent mode | ✅ 2000 completions/mo |
| **VS Code + GitHub Copilot** | If you already use VS Code | ✅ Free plan available |
| **Windsurf** | Agent-style coding (Cascade) | ✅ Free tier available |

### Setting Up Cursor (Recommended)

```
1. Download Cursor from https://cursor.sh
2. Install it (it's a VS Code fork — same interface)
3. Sign in with your GitHub account
4. Open your project folder: File → Open Folder → select "my-2d-game/"

KEY SHORTCUTS:
- Cmd/Ctrl + K  → Inline AI edit (highlight code, describe what you want)
- Cmd/Ctrl + L  → AI Chat sidebar
- @file          → Reference a file ("@game_api/main.py explain this")
- @codebase      → AI searches your whole project
- Cmd+Shift+I    → Composer (multi-file AI editing)
```

### Project Rules File (Create This First!)

For **Cursor**, create `.cursorrules` in your project root:

```
# Project: Simple 2D Game with AI NPCs

## Architecture
- game-api/ = Python backend (FastAPI + LangChain + Groq LLM)
- game-ui/ = JavaScript frontend (Phaser 3 game engine)
- Frontend talks to backend via WebSocket at ws://localhost:8000/ws/chat

## Tech Stack
- Backend: Python 3.11+, FastAPI, LangChain, langchain-groq, Pydantic, WebSockets
- Frontend: Phaser 3, Webpack, ES6 JavaScript
- LLM: Groq API (free tier) with llama-3.3-70b-versatile model
- No database — use in-memory Python dicts and JSON files

## Coding Style
- Python: Use type hints everywhere. Use Pydantic for data models. Use async/await.
- JavaScript: Use ES6 classes and import/export. No TypeScript.
- Keep all NPC AI logic in Python. JavaScript only handles rendering and user input.

## Game Design
- 2D top-down pixel art game (like Pokemon)
- 2 AI NPCs: Wizard and Blacksmith
- 2 missions: solve wizard riddle → get key → blacksmith forges sword
- Arrow keys to move, SPACE to interact, ESC to close dialogue
```

For **VS Code + Copilot**, put the same content in `.github/copilot-instructions.md`.

### AI IDE Prompts for Each Component

When you reach each component, paste these prompts into your AI IDE chat:

```
COMPONENT 2 (Config):
"Create game-api/config.py using pydantic-settings that loads GROQ_API_KEY
from .env file. Include model name defaulting to llama-3.3-70b-versatile."

COMPONENT 3 (Models):
"Create game-api/game/models.py with Pydantic models: NPCDefinition,
ChatMessage (message + npc_id), ChatResponse (message + give_item +
mission_complete), PlayerState (inventory + missions)."

COMPONENT 5 (Agent):
"Create game-api/agents/npc_agent.py using langchain-groq ChatGroq.
It should build system prompts with game state, call the LLM, and
parse [GIVE_ITEM:x] and [MISSION_COMPLETE:x] from the response."

COMPONENT 8 (API):
"Create game-api/main.py with FastAPI. Add POST /chat, WebSocket /ws/chat
(streaming), POST /reset-memory, and GET /game-state endpoints."
```

### Debugging Tips

```
WHEN SOMETHING BREAKS:
1. Copy the error from terminal
2. Open AI chat (Cmd+L)
3. Paste: "I got this error running game-api/main.py: [error]. 
   Here's my code: @main.py What's wrong?"

WHEN YOU'RE STUCK:
1. Type: "@codebase How does the WebSocket flow from frontend to backend?"

WHEN ADDING FEATURES:
1. Open Composer (Cmd+Shift+I)
2. Type: "Add inventory display. Update @GameScene.js to show inventory
   in top-right corner and @main.py to return inventory in responses."
```

---

## 📂 Component 1: Project Structure & Environment

### Create All Folders

```bash
# Create project root
mkdir my-2d-game && cd my-2d-game

# Python backend
mkdir -p game-api/agents
mkdir -p game-api/game
mkdir -p game-api/data
touch game-api/agents/__init__.py
touch game-api/game/__init__.py

# JavaScript frontend
mkdir -p game-ui/src/scenes
mkdir -p game-ui/src/classes
mkdir -p game-ui/src/services
mkdir -p game-ui/public/assets/tilemaps
mkdir -p game-ui/public/assets/sprites
mkdir -p game-ui/public/assets/ui
```

### Full Project Tree

```
my-2d-game/
├── .cursorrules
├── docker-compose.yml
│
├── game-api/                       # 🐍 PYTHON BACKEND
│   ├── .env                        # Secret keys (never commit)
│   ├── .env.example
│   ├── requirements.txt
│   ├── config.py
│   ├── main.py                     # FastAPI server
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── npc_agent.py            # AI brain for NPCs
│   │   ├── prompts.py              # NPC personality prompts
│   │   └── memory.py               # Conversation history
│   └── game/
│       ├── __init__.py
│       ├── models.py               # Pydantic data models
│       ├── missions.py             # Mission tracking
│       └── npc_registry.py         # NPC definitions
│
└── game-ui/                        # 🎮 JS FRONTEND
    ├── index.html
    ├── package.json
    ├── webpack.config.js
    ├── public/
    │   └── assets/
    │       ├── tilemaps/            # Tiled JSON + tileset PNG
    │       ├── sprites/             # Character spritesheets
    │       └── ui/
    └── src/
        ├── main.js
        ├── scenes/
        │   ├── PreloaderScene.js
        │   └── GameScene.js
        ├── classes/
        │   ├── Player.js
        │   ├── NPC.js
        │   └── DialogueBox.js
        └── services/
            └── WebSocketService.js
```

### Install Python Dependencies

Create this file, then run `pip install -r requirements.txt` inside a virtual environment:

```
# game-api/requirements.txt
fastapi[standard]>=0.115.8
uvicorn>=0.34.0
websockets>=14.0
langchain-core>=0.3.34
langchain-groq>=0.2.4
pydantic>=2.10.6
pydantic-settings>=2.7.1
python-dotenv>=1.0.1
loguru>=0.7.3
```

```bash
cd game-api
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```

### Install JavaScript Dependencies

```json
// game-ui/package.json
{
    "name": "my-2d-game-ui",
    "version": "1.0.0",
    "main": "src/main.js",
    "scripts": {
        "dev": "webpack-dev-server --config webpack.config.js --open",
        "build": "webpack --config webpack.config.js --mode production"
    },
    "dependencies": {
        "phaser": "^3.88.2"
    },
    "devDependencies": {
        "@babel/core": "^7.24.5",
        "@babel/preset-env": "^7.24.5",
        "babel-loader": "^9.1.3",
        "copy-webpack-plugin": "^12.0.2",
        "html-webpack-plugin": "^5.6.0",
        "webpack": "^5.91.0",
        "webpack-cli": "^5.1.4",
        "webpack-dev-server": "^5.0.4"
    }
}
```

```bash
cd game-ui
npm install
```

### Get Free Art Assets

| Asset Type | Where to Get | Link |
|-----------|-------------|------|
| **Tilesets** | Tuxemon (same as PhiloAgents) | https://github.com/Tuxemon/Tuxemon |
| **Character Sprites** | Universal LPC Generator | https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/ |
| **Map Editor** | Tiled Map Editor (free) | https://www.mapeditor.org/ |
| **More tiles** | OpenGameArt LPC | https://opengameart.org/content/lpc-plant-repack |

### Get Your Free Groq API Key

1. Go to https://console.groq.com and sign up
2. Create an API key
3. Put it in `game-api/.env`

---

## ⚙️ Component 2: Python Backend — Config & Settings

This loads secrets from `.env`. Mirrors `philoagents-api/src/philoagents/config.py`.

```python
# game-api/.env.example
# Copy to .env and fill in your key
GROQ_API_KEY=your_groq_api_key_here
```

```python
# game-api/config.py
"""
Configuration using pydantic-settings.
Pattern from: philoagents-api/src/philoagents/config.py
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", extra="ignore", env_file_encoding="utf-8"
    )

    # LLM Configuration
    GROQ_API_KEY: str
    GROQ_LLM_MODEL: str = "llama-3.3-70b-versatile"
    LLM_TEMPERATURE: float = 0.7
    LLM_MAX_TOKENS: int = 200

    # Server Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    # Game Configuration
    MAX_CONVERSATION_HISTORY: int = 20
    INTERACTION_DISTANCE: float = 55.0


settings = Settings()
```

**Test it:**
```python
# python -c "from config import settings; print(settings.GROQ_API_KEY[:8])"
```

---

## 🧱 Component 3: Python Backend — NPC Domain Models

Pydantic data models. Mirrors PhiloAgents' domain models and ChatMessage in their API.

```python
# game-api/game/models.py
"""
Data models for the game.
Pattern from:
  - philoagents-api ChatMessage in infrastructure/api.py
  - philosopher models in domain/
"""
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class NPCDefinition(BaseModel):
    """Static NPC data."""
    id: str
    name: str
    perspective: str = ""
    style: str = ""
    spawn_x: float = 0
    spawn_y: float = 0


class ChatMessage(BaseModel):
    """What frontend sends to backend (same as PhiloAgents' ChatMessage)."""
    message: str
    npc_id: str


class ChatResponse(BaseModel):
    """What backend sends to frontend."""
    message: str
    give_item: Optional[str] = None
    mission_complete: Optional[str] = None
    npc_id: str


class MissionStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class PlayerState(BaseModel):
    """Tracks player's game progress."""
    inventory: list[str] = Field(default_factory=list)
    missions: dict[str, MissionStatus] = Field(default_factory=dict)

    def has_item(self, item: str) -> bool:
        return item in self.inventory

    def add_item(self, item: str) -> None:
        if item not in self.inventory:
            self.inventory.append(item)

    def complete_mission(self, mission_id: str) -> None:
        self.missions[mission_id] = MissionStatus.COMPLETED

    def is_mission_complete(self, mission_id: str) -> bool:
        return self.missions.get(mission_id) == MissionStatus.COMPLETED
```

**Test it:**
```python
# game-api/test_models.py
from game.models import PlayerState

player = PlayerState()
player.add_item("magic_key")
print(f"Has key: {player.has_item('magic_key')}")   # True
player.complete_mission("riddle_quest")
print(f"Riddle done: {player.is_mission_complete('riddle_quest')}")  # True
print("✅ Models work!")
```

---

## 🎭 Component 4: Python Backend — NPC Personality Prompts

The **most important file** — this is what makes NPCs feel alive. PhiloAgents uses
a character card template in `domain/prompts.py` with philosopher_name, perspective, and style.

```python
# game-api/agents/prompts.py
"""
NPC Personality Prompts.
Pattern from: philoagents-api/src/philoagents/domain/prompts.py
"""

CHARACTER_CARD_TEMPLATE = """Let's roleplay. You are {npc_name} — a character in a fantasy village.
You are engaging with a player (adventurer) in conversation.
Use short sentences. Keep responses under 80 words.

---

Character name: {npc_name}
Character role: {npc_perspective}
Talking style: {npc_style}

---

CURRENT GAME STATE:
- Player inventory: {inventory}
- Missions completed: {missions_completed}

CONVERSATION SUMMARY SO FAR:
{summary}

---

RULES:
1. Never mention you are an AI or assistant.
2. Stay in character at ALL times.
3. Keep responses under 80 words.
4. If giving an item, include EXACTLY: [GIVE_ITEM:item_name]
5. If completing a mission, include EXACTLY: [MISSION_COMPLETE:mission_id]
6. Plain text only — no markdown, no asterisks.

---

{mission_instructions}

The conversation starts now.
"""


NPC_CONFIGS = {
    "wizard": {
        "name": "Zephyr the Wise",
        "perspective": (
            "An ancient wizard who has lived for centuries. "
            "You guard the Magic Key that can only be given to the worthy. "
            "You love riddles and ancient knowledge."
        ),
        "style": (
            "Speaks mysteriously and cryptically. Uses 'indeed', 'curious', 'fascinating'. "
            "Friendly but enigmatic."
        ),
        "mission_instructions": """
YOUR MISSION — THE RIDDLE QUEST:
You have a Magic Key. Give it ONLY if the player solves your riddle.

YOUR RIDDLE: "I have cities, but no houses. Mountains, but no trees.
Water, but no fish. What am I?"
ANSWER: A map.

BEHAVIOR:
- First conversation: greet them, ask if they seek wisdom
- When they ask about quest: present your riddle
- Correct answer ("map" or similar): celebrate, include [GIVE_ITEM:magic_key] [MISSION_COMPLETE:riddle_quest]
- Wrong answer: give a hint ("Think about something you can hold that shows the world...")
- Already has magic_key: say "The blacksmith awaits you!"
- forge_quest done: say "You are a true hero!"
"""
    },
    "blacksmith": {
        "name": "Brunhild the Strong",
        "perspective": (
            "A gruff but warm blacksmith. "
            "Can forge the legendary Sword of Dawn with the Magic Key."
        ),
        "style": (
            "Speaks plainly and directly. Short punchy sentences. "
            "Says 'Aye', 'Right then', 'Listen here'. Loves fire and metal."
        ),
        "mission_instructions": """
YOUR MISSION — THE FORGE QUEST:
Forge Sword of Dawn if player has Magic Key.

BEHAVIOR:
- No magic_key in inventory: "I need a Magic Key. Go see the wizard!"
- Has magic_key: get excited, forge sword. Include [GIVE_ITEM:sword_of_dawn] [MISSION_COMPLETE:forge_quest]
- forge_quest done: "Finest blade I ever made!"
"""
    }
}


def build_system_prompt(
    npc_id: str,
    inventory: list[str],
    missions_completed: dict[str, str],
    summary: str = ""
) -> str:
    """Build full system prompt for an NPC with current game state."""
    config = NPC_CONFIGS.get(npc_id)
    if not config:
        return "You are a friendly villager. Chat casually."

    return CHARACTER_CARD_TEMPLATE.format(
        npc_name=config["name"],
        npc_perspective=config["perspective"],
        npc_style=config["style"],
        inventory=inventory,
        missions_completed=missions_completed,
        summary=summary if summary else "No previous conversation.",
        mission_instructions=config["mission_instructions"]
    )
```

```python
# game-api/game/npc_registry.py
"""NPC Registry. Pattern from PhiloAgents' PhilosopherFactory."""
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
            )

    def get_npc(self, npc_id: str) -> NPCDefinition:
        if npc_id not in self._npcs:
            raise KeyError(f"NPC '{npc_id}' not found.")
        return self._npcs[npc_id]

    def get_all_npcs(self) -> list[NPCDefinition]:
        return list(self._npcs.values())
```

---

## 🧠 Component 5: Python Backend — AI Agent (The NPC Brain)

Core AI logic. PhiloAgents uses LangGraph in `application/conversation_service/`.
We simplify to plain LangChain calls.

```python
# game-api/agents/npc_agent.py
"""
NPC AI Agent.
Simplified from: philoagents-api application/conversation_service/
"""
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
            api_key=settings.GROQ_API_KEY,
            model=settings.GROQ_LLM_MODEL,
            temperature=settings.LLM_TEMPERATURE,
            max_tokens=settings.LLM_MAX_TOKENS,
        )
        self.memory = ConversationMemory(max_messages=settings.MAX_CONVERSATION_HISTORY)
        logger.info(f"NPCAgent ready | model: {settings.GROQ_LLM_MODEL}")

    async def chat(
        self, npc_id: str, player_message: str,
        inventory: list[str], missions_completed: dict[str, str],
    ) -> ChatResponse:
        """Process player message, return NPC response."""
        logger.info(f"Player → {npc_id}: {player_message}")

        summary = self.memory.get_summary(npc_id)
        system_prompt = build_system_prompt(npc_id, inventory, missions_completed, summary)

        messages = [SystemMessage(content=system_prompt)]
        messages.extend(self.memory.get_history(npc_id))
        messages.append(HumanMessage(content=player_message))

        try:
            response = await self.llm.ainvoke(messages)
            raw_text = response.content
        except Exception as e:
            logger.error(f"LLM error: {e}")
            raw_text = "Hmm, my mind seems clouded. Say that again?"

        self.memory.add_message(npc_id, "human", player_message)
        self.memory.add_message(npc_id, "ai", raw_text)

        give_item = self._extract_command(raw_text, "GIVE_ITEM")
        mission_complete = self._extract_command(raw_text, "MISSION_COMPLETE")
        clean_text = self._clean_response(raw_text)

        logger.info(f"{npc_id} → Player: {clean_text}")

        return ChatResponse(
            message=clean_text, give_item=give_item,
            mission_complete=mission_complete, npc_id=npc_id,
        )

    async def chat_streaming(
        self, npc_id: str, player_message: str,
        inventory: list[str], missions_completed: dict[str, str],
    ):
        """Stream NPC response token by token (for real-time feel)."""
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
```

---

## 💭 Component 6: Python Backend — Conversation Memory

PhiloAgents stores memory in MongoDB. We use simple Python dicts.

```python
# game-api/agents/memory.py
"""
Conversation Memory per NPC.
Simplified from PhiloAgents' MongoDB-backed memory (Module 3).
"""
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
```

---

## 🎯 Component 7: Python Backend — Mission System

```python
# game-api/game/missions.py
"""Mission tracking system."""
from typing import Optional
from loguru import logger
from game.models import PlayerState, MissionStatus


class MissionManager:
    def __init__(self):
        self.player_state = PlayerState(
            missions={
                "riddle_quest": MissionStatus.NOT_STARTED,
                "forge_quest": MissionStatus.NOT_STARTED,
            }
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

        if mission_complete and not self.player_state.is_mission_complete(mission_complete):
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
        self.player_state = PlayerState(
            missions={"riddle_quest": MissionStatus.NOT_STARTED, "forge_quest": MissionStatus.NOT_STARTED}
        )
```

---

## 🌐 Component 8: Python Backend — FastAPI + WebSocket Server

The main server. Directly modeled after PhiloAgents' `infrastructure/api.py`.

```python
# game-api/main.py
"""
FastAPI Server with WebSocket.
Pattern from: philoagents-api/src/philoagents/infrastructure/api.py
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from agents.npc_agent import NPCAgent
from game.missions import MissionManager
from game.models import ChatMessage


npc_agent: NPCAgent = None
mission_manager: MissionManager = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global npc_agent, mission_manager
    logger.info("🚀 Starting Game API...")
    npc_agent = NPCAgent()
    mission_manager = MissionManager()
    logger.info("✅ Game API ready!")
    yield
    logger.info("👋 Shutting down...")


app = FastAPI(title="My 2D Game API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "alive"}


@app.post("/chat")
async def chat(msg: ChatMessage):
    try:
        response = await npc_agent.chat(
            npc_id=msg.npc_id, player_message=msg.message,
            inventory=mission_manager.get_inventory(),
            missions_completed={k: v.value for k, v in mission_manager.get_missions().items()},
        )
        actions = mission_manager.process_npc_actions(response.give_item, response.mission_complete)
        return {
            "response": response.message, "give_item": response.give_item,
            "mission_complete": response.mission_complete, "game_actions": actions,
            "inventory": mission_manager.get_inventory(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    """Streaming WebSocket — same protocol as PhiloAgents."""
    await websocket.accept()
    logger.info("🔌 Player connected")

    try:
        while True:
            data = await websocket.receive_json()

            if "message" not in data or "npc_id" not in data:
                await websocket.send_json({"error": "Need 'message' and 'npc_id'"})
                continue

            try:
                await websocket.send_json({"streaming": True})

                full_response = ""
                async for chunk in npc_agent.chat_streaming(
                    npc_id=data["npc_id"], player_message=data["message"],
                    inventory=mission_manager.get_inventory(),
                    missions_completed={k: v.value for k, v in mission_manager.get_missions().items()},
                ):
                    full_response += chunk
                    await websocket.send_json({"chunk": chunk})

                give_item = npc_agent._extract_command(full_response, "GIVE_ITEM")
                mission_complete = npc_agent._extract_command(full_response, "MISSION_COMPLETE")
                clean = npc_agent._clean_response(full_response)
                actions = mission_manager.process_npc_actions(give_item, mission_complete)

                await websocket.send_json({
                    "response": clean, "streaming": False,
                    "give_item": give_item, "mission_complete": mission_complete,
                    "game_actions": actions, "inventory": mission_manager.get_inventory(),
                })
            except Exception as e:
                await websocket.send_json({"error": str(e)})

    except WebSocketDisconnect:
        logger.info("🔌 Player disconnected")


@app.post("/reset-memory")
async def reset():
    npc_agent.reset_memory()
    mission_manager.reset()
    return {"status": "reset"}


@app.get("/game-state")
def game_state():
    return {
        "inventory": mission_manager.get_inventory(),
        "missions": {k: v.value for k, v in mission_manager.get_missions().items()},
        "game_complete": mission_manager.is_game_complete(),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

---

## 🎮 Component 9: Game Frontend — Phaser 3 Setup

```javascript
// game-ui/webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: { path: path.resolve(__dirname, 'dist'), filename: 'bundle.js', clean: true },
    devServer: { port: 8080, hot: true },
    module: {
        rules: [{
            test: /\.js$/, exclude: /node_modules/,
            use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './index.html' }),
        new CopyWebpackPlugin({ patterns: [{ from: 'public/assets', to: 'assets' }] }),
    ]
};
```

```html
<!-- game-ui/index.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>The Wise Village</title>
    <style>body{margin:0;background:#000;overflow:hidden}#game{display:flex;justify-content:center;align-items:center;height:100vh}</style>
</head>
<body><div id="game"></div></body>
</html>
```

```javascript
// game-ui/src/main.js
import Phaser from 'phaser';
import PreloaderScene from './scenes/PreloaderScene';
import GameScene from './scenes/GameScene';

new Phaser.Game({
    type: Phaser.AUTO,
    width: 800, height: 600,
    parent: 'game',
    pixelArt: true,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
    scene: [PreloaderScene, GameScene]
});
```

---

## 🗺️ Component 10: Game Frontend — Map, Player & NPCs

```javascript
// game-ui/src/scenes/PreloaderScene.js
import Phaser from 'phaser';

export default class PreloaderScene extends Phaser.Scene {
    constructor() { super({ key: 'PreloaderScene' }); }

    preload() {
        this.add.text(400, 300, 'Loading...', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/village.json');
        this.load.image('tiles', 'assets/tilemaps/tileset.png');
        this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('wizard', 'assets/sprites/wizard.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('blacksmith', 'assets/sprites/blacksmith.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() { this.scene.start('GameScene'); }
}
```

```javascript
// game-ui/src/classes/Player.js
import Phaser from 'phaser';

export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'player').setSize(24, 36);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.speed = 120;
        this.frozen = false;

        const a = scene.anims;
        ['down','up','left','right'].forEach((dir, i) => {
            if (!a.exists(`p-${dir}`))
                a.create({ key:`p-${dir}`, frames:a.generateFrameNumbers('player',{start:i*4,end:i*4+3}), frameRate:8, repeat:-1 });
        });
    }

    freeze()   { this.frozen = true;  this.sprite.setVelocity(0); this.sprite.anims.stop(); }
    unfreeze() { this.frozen = false; }

    update() {
        if (this.frozen) return;
        const c = this.cursors;
        this.sprite.setVelocity(0);
        if      (c.left.isDown)  { this.sprite.setVelocityX(-this.speed); this.sprite.anims.play('p-left', true); }
        else if (c.right.isDown) { this.sprite.setVelocityX(this.speed);  this.sprite.anims.play('p-right', true); }
        else if (c.up.isDown)    { this.sprite.setVelocityY(-this.speed); this.sprite.anims.play('p-up', true); }
        else if (c.down.isDown)  { this.sprite.setVelocityY(this.speed);  this.sprite.anims.play('p-down', true); }
        else this.sprite.anims.stop();
    }
}
```

```javascript
// game-ui/src/classes/NPC.js
import Phaser from 'phaser';

export default class NPC {
    constructor(scene, x, y, spriteKey, npcId, displayName) {
        this.scene = scene;
        this.npcId = npcId;
        this.displayName = displayName;
        this.sprite = scene.physics.add.sprite(x, y, spriteKey).setImmovable(true).setSize(24, 36);
        this.label = scene.add.text(x, y - 30, displayName, {
            fontSize: '11px', fill: '#ffcc00', backgroundColor: '#00000088', padding: { x: 3, y: 1 }
        }).setOrigin(0.5);

        this._wander();
    }

    _wander() {
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 5000),
            callback: () => {
                const dir = Phaser.Math.Between(0, 4);
                const spd = 30;
                this.sprite.setVelocity(0);
                if (dir === 0) this.sprite.setVelocityX(-spd);
                else if (dir === 1) this.sprite.setVelocityX(spd);
                else if (dir === 2) this.sprite.setVelocityY(-spd);
                else if (dir === 3) this.sprite.setVelocityY(spd);
                this.scene.time.delayedCall(800, () => this.sprite.setVelocity(0));
                this._wander();
            }
        });
    }

    isPlayerNearby(playerSprite, dist = 55) {
        return Phaser.Math.Distance.Between(playerSprite.x, playerSprite.y, this.sprite.x, this.sprite.y) < dist;
    }

    update() {
        this.label.setPosition(this.sprite.x, this.sprite.y - 30);
    }
}
```

---

## 💬 Component 11: Game Frontend — Dialogue & WebSocket

```javascript
// game-ui/src/classes/DialogueBox.js
export default class DialogueBox {
    constructor(scene) {
        this.scene = scene;
        this.bg = null; this.nameText = null; this.msgText = null; this.inputEl = null;
        this.onSubmit = null;
    }

    show(name, msg) {
        this.hide();
        this.bg = this.scene.add.graphics().fillStyle(0x000000, 0.8).fillRect(25, 430, 750, 160)
            .lineStyle(2, 0xffffff).strokeRect(25, 430, 750, 160).setScrollFactor(0).setDepth(100);
        this.nameText = this.scene.add.text(45, 440, name, { fontSize:'16px', fill:'#ffcc00', fontStyle:'bold' })
            .setScrollFactor(0).setDepth(101);
        this.msgText = this.scene.add.text(45, 465, msg, { fontSize:'14px', fill:'#fff', wordWrap:{width:710} })
            .setScrollFactor(0).setDepth(101);
    }

    showResponse(name, msg) {
        if (this.nameText) this.nameText.setText(name);
        if (this.msgText) this.msgText.setText(msg);
    }

    showLoading() { if (this.msgText) this.msgText.setText('...'); }

    enableInput(callback) {
        this.onSubmit = callback;
        if (this.inputEl) this.inputEl.remove();
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'text';
        this.inputEl.placeholder = 'Type your message... (Enter to send, ESC to close)';
        this.inputEl.style.cssText = 'position:fixed;bottom:25px;left:50px;width:620px;padding:8px;font-size:14px;border:2px solid #ffcc00;background:#222;color:#fff;border-radius:4px;z-index:9999;';
        document.body.appendChild(this.inputEl);
        this.inputEl.focus();
        this.inputEl.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if (e.key === 'Enter' && this.inputEl.value.trim()) {
                const text = this.inputEl.value.trim();
                this.inputEl.value = '';
                if (this.onSubmit) this.onSubmit(text);
            }
        });
    }

    hide() {
        if (this.bg) { this.bg.destroy(); this.bg = null; }
        if (this.nameText) { this.nameText.destroy(); this.nameText = null; }
        if (this.msgText) { this.msgText.destroy(); this.msgText = null; }
        if (this.inputEl) { this.inputEl.remove(); this.inputEl = null; }
    }
}
```

```javascript
// game-ui/src/services/WebSocketService.js
/**
 * WebSocket client. Pattern from: philoagents-ui/src/services/WebSocketApiService.js
 */
export default class WebSocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.baseUrl = 'ws://localhost:8000';
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(`${this.baseUrl}/ws/chat`);
            this.socket.onopen = () => { this.connected = true; console.log('WS connected'); resolve(); };
            this.socket.onerror = (e) => { console.error('WS error', e); reject(e); };
            this.socket.onclose = () => { this.connected = false; console.log('WS closed'); };
        });
    }

    async sendMessage(npcId, message) {
        if (!this.connected) await this.connect();

        return new Promise((resolve) => {
            this.socket.send(JSON.stringify({ npc_id: npcId, message }));

            const chunks = [];
            const handler = (event) => {
                const data = JSON.parse(event.data);
                if (data.chunk) chunks.push(data.chunk);
                if (data.response !== undefined) {
                    this.socket.removeEventListener('message', handler);
                    resolve(data);
                }
            };
            this.socket.addEventListener('message', handler);
        });
    }
}
```

```javascript
// game-ui/src/scenes/GameScene.js
import Phaser from 'phaser';
import Player from '../classes/Player';
import NPC from '../classes/NPC';
import DialogueBox from '../classes/DialogueBox';
import WebSocketService from '../services/WebSocketService';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.inDialogue = false;
    }

    create() {
        // Simple colored background if no tilemap yet
        this.cameras.main.setBackgroundColor('#4a7a3b');

        // Uncomment these when you have a Tiled map ready:
        // const map = this.make.tilemap({ key: 'map' });
        // const tileset = map.addTilesetImage('tileset', 'tiles');
        // map.createLayer('Ground', tileset);
        // const walls = map.createLayer('Walls', tileset);
        // if (walls) walls.setCollisionByProperty({ collides: true });

        this.player = new Player(this, 400, 300);
        this.npcs = [
            new NPC(this, 200, 150, 'wizard', 'wizard', 'Zephyr the Wise'),
            new NPC(this, 600, 400, 'blacksmith', 'blacksmith', 'Brunhild the Strong'),
        ];
        this.dialogueBox = new DialogueBox(this);
        this.ws = new WebSocketService();
        this.ws.connect().catch(e => console.warn('Backend not running yet:', e));

        this.spaceKey = this.input.keyboard.addKey('SPACE');
        this.escKey = this.input.keyboard.addKey('ESC');

        // Inventory display
        this.invText = this.add.text(10, 10, 'Inventory: (empty)', { fontSize:'13px', fill:'#fff', backgroundColor:'#00000088', padding:{x:5,y:3} })
            .setScrollFactor(0).setDepth(50);
    }

    update() {
        if (this.inDialogue) {
            if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
                this.dialogueBox.hide(); this.inDialogue = false; this.player.unfreeze();
            }
            return;
        }
        this.player.update();
        this.npcs.forEach(n => n.update());

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            for (const npc of this.npcs) {
                if (npc.isPlayerNearby(this.player.sprite)) { this.startDialogue(npc); break; }
            }
        }
    }

    startDialogue(npc) {
        this.inDialogue = true;
        this.player.freeze();
        this.dialogueBox.show(npc.displayName, 'Type your message and press Enter...');
        this.dialogueBox.enableInput(async (text) => {
            this.dialogueBox.showLoading();
            try {
                const resp = await this.ws.sendMessage(npc.npcId, text);
                this.dialogueBox.showResponse(npc.displayName, resp.response || '...');
                if (resp.inventory) this.invText.setText('Inventory: ' + (resp.inventory.length ? resp.inventory.join(', ') : '(empty)'));
                if (resp.game_actions?.game_complete) {
                    this.dialogueBox.showResponse('🎉 VICTORY', 'All missions complete! You win!');
                }
            } catch (e) {
                this.dialogueBox.showResponse(npc.displayName, '*seems lost in thought...*');
            }
        });
    }
}
```

---

## 🐳 Component 12: Docker & Running Everything

```yaml
# docker-compose.yml
version: "3.8"
services:
  game-api:
    build: ./game-api
    ports: ["8000:8000"]
    env_file: ./game-api/.env
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  game-ui:
    build: ./game-ui
    ports: ["8080:8080"]
    depends_on: [game-api]
```

```dockerfile
# game-api/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```dockerfile
# game-ui/Dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npx", "webpack-dev-server", "--config", "webpack.config.js", "--host", "0.0.0.0", "--port", "8080"]
```

### Running Without Docker

```bash
# Terminal 1: Python backend
cd game-api
source venv/bin/activate   # or venv\Scripts\activate on Windows
python main.py

# Terminal 2: JS frontend
cd game-ui
npm run dev
```

### Running With Docker

```bash
docker compose up --build
# Game at http://localhost:8080
# API at http://localhost:8000/health
```

---

## 🧪 Component 13: Testing Each Component

```python
# game-api/test_all.py
"""Run all tests: python test_all.py"""
import asyncio


def test_config():
    print("--- Testing Config ---")
    from config import settings
    assert settings.GROQ_API_KEY, "GROQ_API_KEY not set!"
    print(f"  ✅ API Key: {settings.GROQ_API_KEY[:8]}...")
    print(f"  ✅ Model: {settings.GROQ_LLM_MODEL}")


def test_models():
    print("--- Testing Models ---")
    from game.models import PlayerState, ChatMessage, ChatResponse
    p = PlayerState()
    p.add_item("magic_key")
    assert p.has_item("magic_key")
    p.complete_mission("riddle_quest")
    assert p.is_mission_complete("riddle_quest")
    msg = ChatMessage(message="hi", npc_id="wizard")
    resp = ChatResponse(message="hello", npc_id="wizard", give_item="key")
    print("  ✅ All models work")


def test_prompts():
    print("--- Testing Prompts ---")
    from agents.prompts import build_system_prompt
    prompt = build_system_prompt("wizard", ["magic_key"], {"riddle_quest": "completed"})
    assert "Zephyr" in prompt
    assert "magic_key" in prompt
    print(f"  ✅ Prompt length: {len(prompt)} chars")


def test_memory():
    print("--- Testing Memory ---")
    from agents.memory import ConversationMemory
    mem = ConversationMemory(max_messages=4)
    mem.add_message("wizard", "human", "Hello")
    mem.add_message("wizard", "ai", "Greetings!")
    assert len(mem.get_history("wizard")) == 2
    mem.reset("wizard")
    assert len(mem.get_history("wizard")) == 0
    print("  ✅ Memory works")


def test_missions():
    print("--- Testing Missions ---")
    from game.missions import MissionManager
    mm = MissionManager()
    result = mm.process_npc_actions("magic_key", "riddle_quest")
    assert "magic_key" in mm.get_inventory()
    assert result["missions_completed"] == ["riddle_quest"]
    result2 = mm.process_npc_actions("sword_of_dawn", "forge_quest")
    assert result2["game_complete"] == True
    print("  ✅ Missions work, game complete!")


async def test_agent():
    print("--- Testing AI Agent (live LLM call) ---")
    from agents.npc_agent import NPCAgent
    agent = NPCAgent()
    resp = await agent.chat(
        npc_id="wizard", player_message="Hello, wise one!",
        inventory=[], missions_completed={},
    )
    print(f"  NPC says: {resp.message[:80]}...")
    assert len(resp.message) > 0
    print("  ✅ AI Agent works!")


if __name__ == "__main__":
    test_config()
    test_models()
    test_prompts()
    test_memory()
    test_missions()
    asyncio.run(test_agent())
    print("\n🎉 ALL TESTS PASSED!")
```

### Test the API with curl

```bash
# Health check
curl http://localhost:8000/health

# Chat with wizard
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello wizard!", "npc_id": "wizard"}'

# Check game state
curl http://localhost:8000/game-state

# Test WebSocket with Python
python -c "
import asyncio, websockets, json
async def test():
    async with websockets.connect('ws://localhost:8000/ws/chat') as ws:
        await ws.send(json.dumps({'message':'Hello!','npc_id':'wizard'}))
        while True:
            r = json.loads(await ws.recv())
            if r.get('chunk'): print(r['chunk'], end='', flush=True)
            if 'response' in r: print(); print('DONE:', r); break
asyncio.run(test())
"

# Reset game
curl -X POST http://localhost:8000/reset-memory
```

---

## 🗺️ Creating Your Map with Tiled

1. Download **Tiled** from https://www.mapeditor.org/ (free)
2. Create new map: **30×20 tiles**, **32×32px** tile size
3. Import tileset PNG (from Tuxemon assets)
4. Create layers: `Ground` (grass, paths) → `Walls` (buildings, trees)
5. On Walls layer, select tiles and add custom property: `collides: true`
6. **File → Export As** → save as `game-ui/public/assets/tilemaps/village.json`
7. Copy your tileset PNG to `game-ui/public/assets/tilemaps/tileset.png`

**Tip**: Until you have a map, the game uses a green background. The map is optional to start!

---

## 📊 Build Order Checklist

| # | Task | Test Command | ✅ |
|---|------|-------------|---|
| 1 | Install Python + Node.js + Git | `python --version && node --version` | ☐ |
| 2 | Create folder structure | Check folders exist | ☐ |
| 3 | Get Groq API key, create `.env` | `python test_config.py` | ☐ |
| 4 | Build `config.py` | Import test | ☐ |
| 5 | Build `game/models.py` | `python test_models.py` | ☐ |
| 6 | Build `agents/prompts.py` | `python test_prompts.py` | ☐ |
| 7 | Build `agents/memory.py` | `python test_memory.py` | ☐ |
| 8 | Build `game/missions.py` | `python test_missions.py` | ☐ |
| 9 | Build `agents/npc_agent.py` | `python test_agent.py` | ☐ |
| 10 | Build `main.py` (FastAPI) | `curl localhost:8000/health` | ☐ |
| 11 | Test full backend with curl | Chat + game-state endpoints | ☐ |
| 12 | Build frontend files | `npm run dev` | ☐ |
| 13 | Get sprite assets | Place in assets/ folder | ☐ |
| 14 | Connect frontend to backend | Open game, press SPACE near NPC | ☐ |
| 15 | Test full game loop | Solve riddle → get key → forge sword | ☐ |
| 16 | (Optional) Create Tiled map | Replace green background | ☐ |
| 17 | (Optional) Docker compose | `docker compose up` | ☐ |

---

## 🚀 Possible Upgrades After You Finish

Study the PhiloAgents source for these advanced features:

| Feature | PhiloAgents Module | What to Learn |
|---------|-------------------|---------------|
| **RAG Knowledge** | Module 2 | Give NPCs Wikipedia knowledge |
| **MongoDB Memory** | Module 3 | Persistent memory across sessions |
| **LangGraph Agents** | Module 2 | Complex multi-step AI behaviors |
| **Monitoring** | Module 5 | Track AI performance with Opik |
| **More NPCs** | — | Add merchants, guards, villagers |
| **Combat System** | — | Use sword_of_dawn to fight a boss |

---

*Guide generated from analysis of [neural-maze/philoagents-course](https://github.com/neural-maze/philoagents-course) — an open-source course on building AI-powered game simulations.*
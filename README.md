<![CDATA[<div align="center">

# ⚔️ AI Village Quest

### _A 2D AI-Powered RPG with Intelligent NPCs_

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Phaser](https://img.shields.io/badge/Phaser_3-Game_Engine-8B5CF6?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMiA3bDEwIDVsMTAtNXoiIGZpbGw9IndoaXRlIi8+PC9zdmc+)](https://phaser.io)
[![LangChain](https://img.shields.io/badge/LangChain-Groq_LLM-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](https://langchain.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> _Explore a fantasy village, solve riddles, forge legendary weapons, and slay a dragon — all powered by real-time AI conversations with intelligent NPCs._

---

<img src="docs/images/demo.png" alt="AI Village Quest - Gameplay Demo" width="800" />

_**Live gameplay** showing the village with NPCs roaming, mission HUD, and the Tiny Swords tileset._

</div>

---

## 🌟 Overview

**AI Village Quest** is a 2D top-down RPG where every NPC conversation is powered by a real AI language model. Unlike scripted dialogue trees, each NPC has a unique personality, remembers past conversations, and reacts dynamically to your inventory and quest progress.

### ✨ Key Features

| Feature | Description |
|:--------|:------------|
| 🤖 **AI-Powered NPCs** | Each NPC uses Groq LLM with unique personality prompts — no scripted dialogue trees |
| 🗡️ **5 Interconnected Quests** | Sequential quest chain with branching paths — solve riddles, forge weapons, slay a dragon |
| 🐉 **Dragon Boss Fight** | Final boss that reacts to your inventory — mock you if unprepared, or fall to the Sword of Dawn |
| 🚶 **Living Village** | NPCs roam freely, return home, and chat with each other in real-time speech bubbles |
| 💬 **NPC-NPC Conversations** | Watch villagers interact — 18+ unique dialogue exchanges between NPC pairs |
| 🗺️ **Pixel Art World** | Beautiful Tiny Swords tileset with cliffs, bridges, buildings, and water |
| 🔄 **Real-Time WebSocket** | Streaming AI responses for instant, natural-feeling conversations |
| 🎮 **Full Game Loop** | Inventory system, mission tracker, restart button, and victory sequence |

---

## 🎮 Gameplay

### The Quest Chain

You arrive in a village threatened by **Ignis the Dread**, a fearsome dragon. To save the village, you must gather allies and equipment:

```
┌─────────────────┐     magic_key      ┌──────────────────┐    sword_of_dawn
│  🧙 Wizard      │ ────────────────►  │  🔨 Blacksmith   │ ───────────┐
│  Solve riddle:  │                    │  Forge the sword │            │
│  "What has      │                    │  with the key    │            │
│   cities but    │                    └──────────────────┘            │
│   no houses?"   │                                                   ▼
└─────────────────┘                                          ┌────────────────┐
                                                             │  ⚔️ Captain    │
┌─────────────────┐    healing_potion   ┌──────────────┐     │  Gives medal   │
│  🌿 Herbalist   │ ────────────────►  │  Go prepared  │────►│  + dragon info │
│  Solve riddle:  │                    │  to battle!   │     └────────────────┘
│  "Not alive,    │                    └──────────────┘              │
│   but I grow?"  │                                                  ▼
└─────────────────┘                                          ┌────────────────┐
                                                             │  🐉 DRAGON     │
                                                             │  Final Boss!   │
                                                             │  ⚔️ → 🎉      │
                                                             └────────────────┘
```

### NPCs & Personalities

| NPC | Personality | What They Do |
|:----|:------------|:-------------|
| 🧙 **Zephyr the Wise** | Mysterious, cryptic, loves riddles | Guards the Magic Key — solve his riddle to earn it |
| 🔨 **Brunhild the Strong** | Gruff, direct, loves fire and metal | Forges the legendary Sword of Dawn with the Magic Key |
| 🌿 **Elara the Herbalist** | Gentle, nature-loving, nurturing | Brews a Healing Potion — solve her nature riddle |
| ⚔️ **Captain Aldric** | Military authority, protective | Prepares you for battle — needs both sword and potion |
| 🐉 **Ignis the Dread** | Arrogant, menacing, fire-breathing | The final boss — only falls to the Sword of Dawn |

### Controls

| Key | Action |
|:----|:-------|
| `↑ ↓ ← →` | Move the player |
| `SPACE` | Talk to nearby NPC |
| `ENTER` | Send message in dialogue |
| `ESC` | Close dialogue |
| `🔄 Restart` | Reset game (top-right button) |

---

## 🏗️ Architecture

```
AI Village Quest/
├── game-api/                    # Python Backend (FastAPI)
│   ├── main.py                  # API server, WebSocket, endpoints
│   ├── config.py                # Environment settings (Groq API key)
│   ├── agents/
│   │   ├── npc_agent.py         # LangChain agent with streaming
│   │   ├── prompts.py           # NPC personality configs & system prompts
│   │   └── memory.py            # Conversation memory management
│   ├── game/
│   │   ├── models.py            # Pydantic models (PlayerState, etc.)
│   │   ├── missions.py          # Mission tracking & game state
│   │   └── npc_registry.py      # NPC registry from configs
│   └── requirements.txt
│
├── game-ui/                     # JavaScript Frontend (Phaser 3)
│   ├── src/
│   │   ├── main.js              # Phaser game config & entry point
│   │   ├── scenes/
│   │   │   ├── PreloaderScene.js # Asset loading with fallback sprites
│   │   │   └── GameScene.js     # Main game loop, HUD, NPC interactions
│   │   ├── classes/
│   │   │   ├── Player.js        # Player movement & animations
│   │   │   ├── NPC.js           # NPC roaming AI & conversations
│   │   │   ├── DialogueBox.js   # Chat UI with text input
│   │   │   ├── SpeechBubble.js  # Floating NPC-NPC chat bubbles
│   │   │   └── TinySwordsMap.js # Custom map format renderer
│   │   └── services/
│   │       └── WebSocketService.js  # WebSocket client
│   ├── public/assets/
│   │   ├── sprites/             # Character spritesheets (generated)
│   │   └── tilemaps/            # Tileset + map JSON
│   ├── index.html
│   ├── webpack.config.js
│   └── package.json
│
├── generate_sprites.py          # Pixel art character generator (Pillow)
├── Tiny_Swords/                 # Original tileset assets
└── README.md
```

### Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Game Engine** | Phaser 3 | 2D rendering, physics, animations |
| **Backend** | FastAPI + Uvicorn | REST + WebSocket API server |
| **AI Engine** | LangChain + Groq | LLM-powered NPC conversations |
| **Bundler** | Webpack 5 + Babel | Frontend build pipeline |
| **Sprites** | Pillow (Python) | Programmatic pixel art generation |
| **Map** | Tiny Swords Tileset | Beautiful 64×64 hand-drawn tiles |

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+** with pip
- **Node.js 18+** with npm
- **Groq API Key** — Get one free at [console.groq.com](https://console.groq.com)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Starbuster2004/Agentic_python_game.git
cd Agentic_python_game
```

### 2️⃣ Backend Setup

```bash
cd game-api

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
echo "GROQ_API_KEY=your_groq_api_key_here" > .env

# Start the API server
python main.py
```

The API server starts at `http://localhost:8000`.

### 3️⃣ Frontend Setup

```bash
cd game-ui

# Install dependencies
npm install

# Generate character sprites
cd ..
python generate_sprites.py
cd game-ui

# Start development server
npm run dev
```

The game opens at `http://localhost:8080`.

### 4️⃣ Play! 🎮

1. Open `http://localhost:8080` in your browser
2. Use arrow keys to move around the village
3. Walk up to an NPC and press `SPACE` to talk
4. Type your message and press `ENTER`
5. Complete all 5 quests to defeat the dragon and win!

---

## 🔧 Configuration

Create a `.env` file in `game-api/`:

```env
# Required
GROQ_API_KEY=gsk_your_key_here

# Optional
LLM_MODEL=llama-3.3-70b-versatile   # Default model
LLM_TEMPERATURE=0.7                  # Creativity level (0.0 - 1.0)
```

### Supported Models (Groq)

| Model | Speed | Quality |
|:------|:------|:--------|
| `llama-3.3-70b-versatile` | ⚡ Fast | ⭐⭐⭐ Best |
| `llama-3.1-8b-instant` | ⚡⚡⚡ Fastest | ⭐⭐ Good |
| `mixtral-8x7b-32768` | ⚡⚡ Medium | ⭐⭐⭐ Great |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/health` | Health check |
| `POST` | `/chat` | Send a message to an NPC |
| `WS` | `/ws/chat` | WebSocket for streaming NPC conversations |
| `POST` | `/reset-memory` | Reset game state (inventory, missions, memory) |
| `GET` | `/game-state` | Get current player inventory & mission status |

---

## 🎨 Character Sprites

All character sprites are **procedurally generated** using Python's Pillow library via `generate_sprites.py`:

| Character | Description | Frame Size |
|:----------|:------------|:-----------|
| 🧑 Player | Green tunic adventurer with gold belt | 32×48 |
| 🧙 Wizard | Purple robe, pointy hat, staff with orb, white beard | 32×48 |
| 🔨 Blacksmith | Red-brown shirt, leather apron, hammer | 32×48 |
| 🌿 Herbalist | Green dress, flower crown, potion bottle | 32×48 |
| ⚔️ Guard | Silver armor, red cape, shield with cross | 32×48 |
| 🐉 Dragon | Red dragon with horns, wings, fire breath | 48×64 |

Each sprite has **16 frames** (4 directions × 4 walk cycle frames).

---

## 🛠️ Development

### Project Scripts

```bash
# Backend
cd game-api
python main.py                    # Start API server (auto-reload)

# Frontend
cd game-ui
npm run dev                       # Start dev server (hot reload)
npm run build                     # Production build

# Sprites
python generate_sprites.py        # Regenerate all character sprites
```

### Adding a New NPC

1. Add NPC config in `game-api/agents/prompts.py` → `NPC_CONFIGS`
2. Add mission in `game-api/game/missions.py` → `ALL_MISSIONS`
3. Add palette + extras in `generate_sprites.py`, run it
4. Load sprite in `game-ui/src/scenes/PreloaderScene.js`
5. Place NPC in `game-ui/src/scenes/GameScene.js`
6. (Optional) Add NPC-NPC chatter lines in `game-ui/src/classes/NPC.js`

---

## 📸 Screenshots

<div align="center">
<img src="docs/images/demo.png" alt="Village Exploration" width="700" />

_Exploring the village — NPCs roam freely and interact with each other_
</div>

---

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- 🌍 Add more map areas (dungeon, forest, castle)
- 👤 Create more NPCs with unique quests
- ⚔️ Add a real-time combat system
- 🎵 Add background music and sound effects
- 💾 Add save/load game functionality
- 🎨 Replace generated sprites with hand-drawn pixel art

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using Python, Phaser 3, and AI**

_If you enjoyed this project, give it a ⭐!_

</div>
]]>

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

    async resetGame() {
        const resp = await fetch('http://localhost:8000/reset-memory', { method: 'POST' });
        return resp.json();
    }
}
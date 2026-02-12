import Phaser from 'phaser';

export default class PreloaderScene extends Phaser.Scene {
    constructor() { super({ key: 'PreloaderScene' }); }

    preload() {
        // Loading bar
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const bar = this.add.graphics();
        const box = this.add.graphics();
        box.fillStyle(0x222222, 0.8).fillRect(w / 4, h / 2 - 15, w / 2, 30);
        this.add.text(w / 2, h / 2 - 30, 'Loading Village...', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

        this.load.on('progress', (val) => {
            bar.clear().fillStyle(0xffcc00, 1).fillRect(w / 4 + 5, h / 2 - 10, (w / 2 - 10) * val, 20);
        });

        // Tiny Swords spritesheet (512x1536, 64x64 tiles → 8 cols × 24 rows)
        this.load.spritesheet('tileset', 'assets/tilemaps/tileset.png', {
            frameWidth: 64, frameHeight: 64
        });

        // Map data (custom Tiny Swords JSON format)
        this.load.json('mapData', 'assets/tilemaps/village.json');

        // Player and NPC placeholder spritesheets — generate in create()
        this.load.on('loaderror', (file) => {
            console.warn(`Asset not found: ${file.key} — will use placeholder`);
        });

        // Try loading real sprites if they exist
        this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('wizard', 'assets/sprites/wizard.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('blacksmith', 'assets/sprites/blacksmith.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('herbalist', 'assets/sprites/herbalist.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('guard', 'assets/sprites/guard.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('dragon', 'assets/sprites/dragon.png', { frameWidth: 48, frameHeight: 64 });
    }

    create() {
        // Generate placeholder spritesheets for player/NPCs if real ones didn't load
        this._createPlaceholder('player', 0x3498db);
        this._createPlaceholder('wizard', 0x9b59b6);
        this._createPlaceholder('blacksmith', 0xe67e22);
        this._createPlaceholder('herbalist', 0x27ae60);
        this._createPlaceholder('guard', 0x7f8c8d);
        this._createPlaceholder('dragon', 0xcc2222, 48, 64);

        this.scene.start('GameScene');
    }

    _createPlaceholder(key, color, fw = 32, fh = 48) {
        if (this.textures.exists(key)) {
            const tex = this.textures.get(key);
            if (tex.key !== '__MISSING' && tex.frameTotal > 4) return;
        }

        const cols = 4, rows = 4;
        const canvas = document.createElement('canvas');
        canvas.width = fw * cols;
        canvas.height = fh * rows;
        const ctx = canvas.getContext('2d');
        const hex = '#' + color.toString(16).padStart(6, '0');
        const dirs = ['↓', '↑', '←', '→'];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * fw, y = row * fh;
                // Body
                ctx.fillStyle = hex;
                ctx.fillRect(x + 6, y + 12, 20, 28);
                // Head
                ctx.fillStyle = '#fdd';
                ctx.beginPath();
                ctx.arc(x + 16, y + 12, 8, 0, Math.PI * 2);
                ctx.fill();
                // Direction arrow
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(dirs[row], x + 16, y + 34);
                // Legs (animated offset)
                const legOff = (col % 2 === 0) ? -2 : 2;
                ctx.fillStyle = '#333';
                ctx.fillRect(x + 10 + legOff, y + 38, 4, 8);
                ctx.fillRect(x + 18 - legOff, y + 38, 4, 8);
            }
        }

        if (this.textures.exists(key)) this.textures.remove(key);
        this.textures.addSpriteSheet(key, canvas, { frameWidth: fw, frameHeight: fh });
        console.log(`✅ Placeholder: ${key}`);
    }
}
import Phaser from 'phaser';
import SpeechBubble from './SpeechBubble';

/**
 * NPC-NPC idle conversation lines.
 * Each pair has a set of possible exchanges.
 */
const NPC_CHATTER = {
    'wizard-blacksmith': [
        { a: "The stars foretell a hero...", b: "Aye, about time." },
        { a: "Your forge burns bright today.", b: "Best steel needs best fire!" },
        { a: "Fascinating metallurgy, Brunhild.", b: "Magic won't fix a dull blade." },
    ],
    'wizard-herbalist': [
        { a: "Your garden grows beautifully.", b: "Nature provides, dear wizard." },
        { a: "Curious... this herb hums with energy.", b: "Touch it gently, Zephyr." },
        { a: "Any potion for old joints?", b: "I have just the thing!" },
    ],
    'blacksmith-herbalist': [
        { a: "Got any salve for burns?", b: "Again, Brunhild? Here you go." },
        { a: "Smells like flowers in here.", b: "Better than smoke and steel!" },
        { a: "Right then, need more charcoal.", b: "Don't burn my herbs!" },
    ],
    'blacksmith-guard': [
        { a: "Blade's ready for patrol.", b: "Good. We'll need it." },
        { a: "Any trouble at the gate?", b: "Nothing I can't handle." },
        { a: "Need a shield repair?", b: "Aye, took a hit yesterday." },
    ],
    'wizard-guard': [
        { a: "The barrier holds, Captain.", b: "For now. Stay vigilant." },
        { a: "I sense dark magic nearby...", b: "That dragon. I know." },
        { a: "Indeed, troubled times.", b: "We need more heroes." },
    ],
    'herbalist-guard': [
        { a: "Healing potions are ready.", b: "Good. Stock them up." },
        { a: "How are the soldiers?", b: "Tired, but holding on." },
        { a: "This tea will help them rest.", b: "Much appreciated, Elara." },
    ],
};

export default class NPC {
    constructor(scene, x, y, spriteKey, npcId, displayName, config = {}) {
        this.scene = scene;
        this.npcId = npcId;
        this.displayName = displayName;
        this.spriteKey = spriteKey;

        // Home position (NPCs return near here)
        this.homeX = x;
        this.homeY = y;

        // Create sprite
        this.sprite = scene.physics.add.sprite(x, y, spriteKey)
            .setImmovable(true)
            .setSize(24, 36);

        // Name label
        this.label = scene.add.text(x, y - 30, displayName, {
            fontSize: '11px', fill: '#ffcc00',
            backgroundColor: '#00000088', padding: { x: 3, y: 1 }
        }).setOrigin(0.5).setDepth(22);

        // Animations
        this._createAnims();

        // Speech bubble
        this.bubble = new SpeechBubble(scene);
        this.isChatting = false;
        this.lastChatTime = 0;

        // Roaming state
        this.roamState = 'idle'; // idle, walking, pausing
        this.isDragon = config.isDragon || false;

        // Start roaming
        this._scheduleNextAction();
    }

    _createAnims() {
        const key = this.spriteKey;
        const a = this.scene.anims;
        const dirs = ['down', 'up', 'left', 'right'];
        dirs.forEach((dir, i) => {
            const animKey = `${key}-${dir}`;
            if (!a.exists(animKey)) {
                a.create({
                    key: animKey,
                    frames: a.generateFrameNumbers(key, { start: i * 4, end: i * 4 + 3 }),
                    frameRate: 6,
                    repeat: -1
                });
            }
        });
    }

    _tryPlay(dir) {
        const animKey = `${this.spriteKey}-${dir}`;
        if (this.scene.anims.exists(animKey)) {
            this.sprite.anims.play(animKey, true);
        }
    }

    _stopAnim() {
        if (this.sprite.anims.isPlaying) {
            this.sprite.anims.stop();
        }
    }

    _scheduleNextAction() {
        const delay = Phaser.Math.Between(1500, 4500);
        this.scene.time.delayedCall(delay, () => this._doAction());
    }

    _doAction() {
        if (!this.sprite || !this.sprite.active) return;

        // Dragon paces more aggressively
        const speed = this.isDragon ? 45 : 30;

        // Check if too far from home — head back
        const distFromHome = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y, this.homeX, this.homeY
        );

        if (distFromHome > 120) {
            // Walk back toward home
            const angle = Phaser.Math.Angle.Between(
                this.sprite.x, this.sprite.y, this.homeX, this.homeY
            );
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            this.sprite.setVelocity(vx, vy);
            this._playDirectionAnim(vx, vy);
            this.roamState = 'walking';

            this.scene.time.delayedCall(1200, () => {
                this.sprite.setVelocity(0);
                this._stopAnim();
                this.roamState = 'idle';
                this._scheduleNextAction();
            });
            return;
        }

        // Random action: walk, pause, or stand
        const action = Phaser.Math.Between(0, 5);

        if (action <= 3) {
            // Walk in a random direction
            const dirs = [
                { vx: -speed, vy: 0, dir: 'left' },
                { vx: speed, vy: 0, dir: 'right' },
                { vx: 0, vy: -speed, dir: 'up' },
                { vx: 0, vy: speed, dir: 'down' },
            ];
            const chosen = dirs[Phaser.Math.Between(0, 3)];
            this.sprite.setVelocity(chosen.vx, chosen.vy);
            this._tryPlay(chosen.dir);
            this.roamState = 'walking';

            const walkTime = Phaser.Math.Between(600, 1500);
            this.scene.time.delayedCall(walkTime, () => {
                this.sprite.setVelocity(0);
                this._stopAnim();
                this.roamState = 'idle';
                this._scheduleNextAction();
            });
        } else {
            // Stand still and look around
            this.sprite.setVelocity(0);
            this._stopAnim();
            this.roamState = 'idle';
            this._scheduleNextAction();
        }
    }

    _playDirectionAnim(vx, vy) {
        if (Math.abs(vx) > Math.abs(vy)) {
            this._tryPlay(vx < 0 ? 'left' : 'right');
        } else {
            this._tryPlay(vy < 0 ? 'up' : 'down');
        }
    }

    isPlayerNearby(playerSprite, dist = 60) {
        return Phaser.Math.Distance.Between(
            playerSprite.x, playerSprite.y, this.sprite.x, this.sprite.y
        ) < dist;
    }

    /**
     * Try to chat with another NPC if close enough.
     * Returns true if a conversation started.
     */
    tryChatWith(otherNpc) {
        if (this.isChatting || otherNpc.isChatting) return false;

        const now = Date.now();
        if (now - this.lastChatTime < 12000) return false; // Cooldown

        const dist = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            otherNpc.sprite.x, otherNpc.sprite.y
        );

        if (dist > 100) return false;

        // Find conversation lines
        const pairKey1 = `${this.npcId}-${otherNpc.npcId}`;
        const pairKey2 = `${otherNpc.npcId}-${this.npcId}`;
        let lines = NPC_CHATTER[pairKey1] || NPC_CHATTER[pairKey2];
        if (!lines) return false;

        const exchange = lines[Phaser.Math.Between(0, lines.length - 1)];
        const isFirstSpeaker = !!NPC_CHATTER[pairKey1];

        this.isChatting = true;
        otherNpc.isChatting = true;
        this.lastChatTime = now;
        otherNpc.lastChatTime = now;

        // Stop both NPCs
        this.sprite.setVelocity(0);
        otherNpc.sprite.setVelocity(0);
        this._stopAnim();
        otherNpc._stopAnim();

        // Face each other
        if (this.sprite.x < otherNpc.sprite.x) {
            this._tryPlay('right');
            otherNpc._tryPlay('left');
        } else {
            this._tryPlay('left');
            otherNpc._tryPlay('right');
        }

        // First NPC speaks
        const speaker1 = isFirstSpeaker ? this : otherNpc;
        const speaker2 = isFirstSpeaker ? otherNpc : this;

        speaker1.bubble.show(
            speaker1.sprite.x, speaker1.sprite.y,
            speaker1.displayName, exchange.a, 3000
        );

        // Second NPC responds after a delay
        this.scene.time.delayedCall(2000, () => {
            speaker2.bubble.show(
                speaker2.sprite.x, speaker2.sprite.y,
                speaker2.displayName, exchange.b, 3000
            );
        });

        // Free both after conversation
        this.scene.time.delayedCall(5000, () => {
            this.isChatting = false;
            otherNpc.isChatting = false;
        });

        return true;
    }

    update() {
        if (!this.sprite || !this.sprite.active) return;
        this.label.setPosition(this.sprite.x, this.sprite.y - 30);

        // Update bubble position if active
        if (this.bubble.container) {
            const bw = this.bubble.container.width || 80;
            this.bubble.container.setPosition(
                this.sprite.x - bw / 2,
                this.sprite.y - 60
            );
        }
    }
}
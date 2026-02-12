import Phaser from 'phaser';
import Player from '../classes/Player';
import NPC from '../classes/NPC';
import DialogueBox from '../classes/DialogueBox';
import WebSocketService from '../services/WebSocketService';
import TinySwordsMap from '../classes/TinySwordsMap';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.inDialogue = false;
    }

    create() {
        // Load the Tiny Swords map
        const mapData = this.cache.json.get('mapData');
        this.villageMap = new TinySwordsMap(this, mapData, 'tileset');

        // Set world bounds to map size
        this.physics.world.setBounds(0, 0, this.villageMap.widthInPixels, this.villageMap.heightInPixels);

        // Player — spawn near center of map
        const spawnX = 14 * 64 + 32;
        const spawnY = 12 * 64 + 32;
        this.player = new Player(this, spawnX, spawnY);
        this.player.sprite.setCollideWorldBounds(true);
        this.player.sprite.setDepth(20);

        // Add collision between player and map walls
        this.physics.add.collider(this.player.sprite, this.villageMap.getColliders());

        // NPCs — place them in open areas of the map
        this.npcs = [
            new NPC(this, 6 * 64 + 32, 10 * 64 + 32, 'wizard', 'wizard', 'Zephyr the Wise'),
            new NPC(this, 20 * 64 + 32, 10 * 64 + 32, 'blacksmith', 'blacksmith', 'Brunhild the Strong'),
            new NPC(this, 10 * 64 + 32, 13 * 64 + 32, 'herbalist', 'herbalist', 'Elara the Herbalist'),
            new NPC(this, 16 * 64 + 32, 13 * 64 + 32, 'guard', 'guard', 'Captain Aldric'),
        ];

        // Dragon — placed away from the village, at upper edge
        this.dragon = new NPC(this, 25 * 64 + 32, 3 * 64 + 32, 'dragon', 'dragon', '🐉 Ignis the Dread', { isDragon: true });
        this.dragon.sprite.setScale(1.3);
        this.dragon.sprite.setImmovable(true);
        this.dragon.label.setStyle({ fontSize: '12px', fill: '#ff4444', backgroundColor: '#00000088' });
        this.npcs.push(this.dragon);

        // Collisions for all NPCs
        this.npcs.forEach(npc => {
            npc.sprite.setDepth(20);
            this.physics.add.collider(npc.sprite, this.villageMap.getColliders());
        });

        // NPC-NPC collisions (so they don't walk through each other)
        for (let i = 0; i < this.npcs.length; i++) {
            for (let j = i + 1; j < this.npcs.length; j++) {
                this.physics.add.collider(this.npcs[i].sprite, this.npcs[j].sprite);
            }
            // Player-NPC collision
            this.physics.add.collider(this.player.sprite, this.npcs[i].sprite);
        }

        // Dialogue & WebSocket
        this.dialogueBox = new DialogueBox(this);
        this.ws = new WebSocketService();
        this.ws.connect().catch(e => console.warn('Backend not running yet:', e));

        // Input
        this.spaceKey = this.input.keyboard.addKey('SPACE');
        this.escKey = this.input.keyboard.addKey('ESC');

        // Camera follow player
        this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
        this.cameras.main.setBounds(0, 0, this.villageMap.widthInPixels, this.villageMap.heightInPixels);
        this.cameras.main.setZoom(1);

        // === HUD (fixed to camera) ===

        // Inventory
        this.invText = this.add.text(10, 10, '🎒 Inventory: (empty)', {
            fontSize: '13px', fill: '#fff', backgroundColor: '#00000088', padding: { x: 6, y: 4 }
        }).setScrollFactor(0).setDepth(50);

        // Mission tracker
        this.missionText = this.add.text(10, 35, '📜 Missions: ...', {
            fontSize: '11px', fill: '#aaffaa', backgroundColor: '#00000088',
            padding: { x: 6, y: 4 }, lineSpacing: 3
        }).setScrollFactor(0).setDepth(50);

        // Hint text
        this.hintText = this.add.text(400, 580, '', {
            fontSize: '12px', fill: '#ffcc00', backgroundColor: '#00000088', padding: { x: 5, y: 3 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(50);

        // NPC chat check timer (every 6 seconds try NPC-NPC conversations)
        this.time.addEvent({
            delay: 6000,
            loop: true,
            callback: () => this._tryNpcConversations()
        });
    }

    update() {
        if (this.inDialogue) {
            if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
                this.dialogueBox.hide();
                this.inDialogue = false;
                this.player.unfreeze();
                this.hintText.setText('');
            }
            return;
        }

        this.player.update();
        this.npcs.forEach(n => n.update());

        // Check proximity to NPCs for hint
        let nearNpc = null;
        for (const npc of this.npcs) {
            if (npc.isPlayerNearby(this.player.sprite)) {
                nearNpc = npc;
                break;
            }
        }
        this.hintText.setText(nearNpc ? `Press SPACE to talk to ${nearNpc.displayName}` : '');

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && nearNpc) {
            this.startDialogue(nearNpc);
        }
    }

    /**
     * Periodically check if any NPCs are near each other and trigger conversations.
     */
    _tryNpcConversations() {
        if (this.inDialogue) return;

        // Only check friendly NPCs (not dragon)
        const friendlies = this.npcs.filter(n => n.npcId !== 'dragon');

        for (let i = 0; i < friendlies.length; i++) {
            for (let j = i + 1; j < friendlies.length; j++) {
                if (friendlies[i].tryChatWith(friendlies[j])) {
                    return; // Only one conversation at a time
                }
            }
        }
    }

    startDialogue(npc) {
        this.inDialogue = true;
        this.player.freeze();
        this.hintText.setText('ESC to close');

        // Stop the NPC while talking
        npc.sprite.setVelocity(0);

        const prompt = npc.npcId === 'dragon'
            ? '⚔️ The dragon glares at you... type your challenge!'
            : 'Type your message and press Enter...';

        this.dialogueBox.show(npc.displayName, prompt);
        this.dialogueBox.enableInput(async (text) => {
            this.dialogueBox.showLoading();
            try {
                const resp = await this.ws.sendMessage(npc.npcId, text);
                this.dialogueBox.showResponse(npc.displayName, resp.response || '...');

                // Update inventory display
                if (resp.inventory) {
                    const items = resp.inventory.length ? resp.inventory.join(', ') : '(empty)';
                    this.invText.setText('🎒 Inventory: ' + items);
                }

                // Update mission tracker
                if (resp.missions_completed) {
                    this._updateMissionTracker(resp);
                }

                // Dragon defeated!
                if (resp.game_actions?.missions_completed?.includes('dragon_quest')) {
                    this._dragonDefeated();
                }

                // Game complete
                if (resp.game_actions?.game_complete) {
                    this.time.delayedCall(2000, () => {
                        this.dialogueBox.showResponse('🎉 VICTORY!',
                            'All missions complete! The dragon is slain and the village is saved! You are the greatest hero!');
                    });
                }
            } catch (e) {
                this.dialogueBox.showResponse(npc.displayName, '*seems lost in thought...*');
            }
        });
    }

    _updateMissionTracker(resp) {
        const missions = resp.game_actions || {};
        let tracker = '📜 Missions:\n';

        const missionNames = {
            'riddle_quest': 'Wizard\'s Riddle',
            'forge_quest': 'Forge the Sword',
            'herb_quest': 'Herbalist\'s Riddle',
            'guard_quest': 'Guard\'s Blessing',
            'dragon_quest': 'Slay the Dragon'
        };

        if (missions.missions_completed) {
            missions.missions_completed.forEach(m => {
                tracker += ` ✅ ${missionNames[m] || m}\n`;
            });
        }

        this.missionText.setText(tracker);
    }

    _dragonDefeated() {
        // Visual feedback — dragon shrinks and turns red
        this.tweens.add({
            targets: this.dragon.sprite,
            scaleX: 0.3,
            scaleY: 0.3,
            alpha: 0.4,
            duration: 2000,
            ease: 'Sine.easeOut'
        });

        // Update dragon label
        this.dragon.label.setText('💀 Ignis (Defeated)');
        this.dragon.label.setStyle({ fill: '#888888' });

        // Screen flash
        this.cameras.main.flash(500, 255, 200, 50);
        this.cameras.main.shake(300, 0.01);
    }
}
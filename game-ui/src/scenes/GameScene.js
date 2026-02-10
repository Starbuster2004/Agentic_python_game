import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        this.add.text(400, 300, 'Game Started', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        // Initialize player, NPCs, and map here
    }

    update() {
        // Game loop logic
    }
}

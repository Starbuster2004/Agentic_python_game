import Phaser from 'phaser';

export default class NPC extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, id) {
        super(scene, x, y, texture);
        this.id = id;
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // Static body
    }

    interact() {
        console.log(`Interacting with NPC: ${this.id}`);
        // Trigger dialogue event
    }
}

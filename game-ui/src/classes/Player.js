import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
    }

    update(cursors) {
        this.setVelocity(0);

        if (cursors.left.isDown) {
            this.setVelocityX(-160);
        } else if (cursors.right.isDown) {
            this.setVelocityX(160);
        }

        if (cursors.up.isDown) {
            this.setVelocityY(-160);
        } else if (cursors.down.isDown) {
            this.setVelocityY(160);
        }
    }
}

import Phaser from 'phaser';

export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'player').setSize(24, 36);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.speed = 120;
        this.frozen = false;

        const a = scene.anims;
        ['down', 'up', 'left', 'right'].forEach((dir, i) => {
            if (!a.exists(`p-${dir}`))
                a.create({ key: `p-${dir}`, frames: a.generateFrameNumbers('player', { start: i * 4, end: i * 4 + 3 }), frameRate: 8, repeat: -1 });
        });
    }

    freeze() { this.frozen = true; this.sprite.setVelocity(0); this.sprite.anims.stop(); }
    unfreeze() { this.frozen = false; }

    update() {
        if (this.frozen) return;
        const c = this.cursors;
        this.sprite.setVelocity(0);
        if (c.left.isDown) { this.sprite.setVelocityX(-this.speed); this.sprite.anims.play('p-left', true); }
        else if (c.right.isDown) { this.sprite.setVelocityX(this.speed); this.sprite.anims.play('p-right', true); }
        else if (c.up.isDown) { this.sprite.setVelocityY(-this.speed); this.sprite.anims.play('p-up', true); }
        else if (c.down.isDown) { this.sprite.setVelocityY(this.speed); this.sprite.anims.play('p-down', true); }
        else this.sprite.anims.stop();
    }
}
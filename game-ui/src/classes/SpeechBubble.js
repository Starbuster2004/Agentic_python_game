import Phaser from 'phaser';

/**
 * A small floating speech bubble that appears above NPCs
 * when they chat with each other.
 */
export default class SpeechBubble {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
    }

    /**
     * Show a speech bubble above an NPC.
     * @param {number} x
     * @param {number} y
     * @param {string} name - NPC name
     * @param {string} text - What they say
     * @param {number} duration - How long to show (ms)
     */
    show(x, y, name, text, duration = 3500) {
        if (this.container) this.container.destroy();

        const padding = 6;
        const maxWidth = 160;

        // Name label
        const nameText = this.scene.add.text(0, 0, name, {
            fontSize: '9px',
            fontStyle: 'bold',
            fill: '#ffcc00',
            wordWrap: { width: maxWidth }
        });

        // Message text
        const msgText = this.scene.add.text(0, nameText.height + 2, text, {
            fontSize: '8px',
            fill: '#ffffff',
            wordWrap: { width: maxWidth }
        });

        const bubbleW = Math.max(nameText.width, msgText.width) + padding * 2;
        const bubbleH = nameText.height + msgText.height + padding * 2 + 2;

        // Background bubble
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x000000, 0.7);
        bg.fillRoundedRect(-padding, -padding, bubbleW, bubbleH, 6);
        // Small triangle pointer at bottom
        bg.fillTriangle(
            bubbleW / 2 - 5, bubbleH - padding,
            bubbleW / 2 + 5, bubbleH - padding,
            bubbleW / 2, bubbleH - padding + 6
        );

        this.container = this.scene.add.container(x - bubbleW / 2, y - bubbleH - 20, [bg, nameText, msgText]);
        this.container.setDepth(45);

        // Fade in
        this.container.setAlpha(0);
        this.scene.tweens.add({
            targets: this.container,
            alpha: 1,
            duration: 300,
            ease: 'Sine.easeIn'
        });

        // Auto-destroy after duration
        this.scene.time.delayedCall(duration, () => {
            if (this.container) {
                this.scene.tweens.add({
                    targets: this.container,
                    alpha: 0,
                    duration: 400,
                    onComplete: () => {
                        if (this.container) {
                            this.container.destroy();
                            this.container = null;
                        }
                    }
                });
            }
        });
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
    }
}

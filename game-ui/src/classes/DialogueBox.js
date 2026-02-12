export default class DialogueBox {
    constructor(scene) {
        this.scene = scene;
        this.bg = null; this.nameText = null; this.msgText = null; this.inputEl = null;
        this.onSubmit = null;
    }

    show(name, msg) {
        this.hide();
        this.bg = this.scene.add.graphics().fillStyle(0x000000, 0.8).fillRect(25, 430, 750, 160)
            .lineStyle(2, 0xffffff).strokeRect(25, 430, 750, 160).setScrollFactor(0).setDepth(100);
        this.nameText = this.scene.add.text(45, 440, name, { fontSize: '16px', fill: '#ffcc00', fontStyle: 'bold' })
            .setScrollFactor(0).setDepth(101);
        this.msgText = this.scene.add.text(45, 465, msg, { fontSize: '14px', fill: '#fff', wordWrap: { width: 710 } })
            .setScrollFactor(0).setDepth(101);
    }

    showResponse(name, msg) {
        if (this.nameText) this.nameText.setText(name);
        if (this.msgText) this.msgText.setText(msg);
    }

    showLoading() { if (this.msgText) this.msgText.setText('...'); }

    enableInput(callback) {
        this.onSubmit = callback;
        if (this.inputEl) this.inputEl.remove();
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'text';
        this.inputEl.placeholder = 'Type your message... (Enter to send, ESC to close)';
        this.inputEl.style.cssText = 'position:fixed;bottom:25px;left:50px;width:620px;padding:8px;font-size:14px;border:2px solid #ffcc00;background:#222;color:#fff;border-radius:4px;z-index:9999;';
        document.body.appendChild(this.inputEl);
        this.inputEl.focus();
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close dialogue — let the scene know
                this.hide();
                if (this.scene.inDialogue) {
                    this.scene.inDialogue = false;
                    this.scene.player.unfreeze();
                    this.scene.hintText.setText('');
                }
                return;
            }
            e.stopPropagation();
            if (e.key === 'Enter' && this.inputEl.value.trim()) {
                const text = this.inputEl.value.trim();
                this.inputEl.value = '';
                if (this.onSubmit) this.onSubmit(text);
            }
        });
    }

    hide() {
        if (this.bg) { this.bg.destroy(); this.bg = null; }
        if (this.nameText) { this.nameText.destroy(); this.nameText = null; }
        if (this.msgText) { this.msgText.destroy(); this.msgText = null; }
        if (this.inputEl) { this.inputEl.remove(); this.inputEl = null; }
    }
}
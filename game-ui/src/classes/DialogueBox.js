export default class DialogueBox {
    constructor(scene) {
        this.scene = scene;
        this.container = scene.add.container(400, 500);
        this.background = scene.add.rectangle(0, 0, 700, 150, 0x000000, 0.8).setStrokeStyle(2, 0xffffff);
        this.text = scene.add.text(-330, -60, '', { fontSize: '20px', wordWrap: { width: 660 } });

        this.container.add([this.background, this.text]);
        this.container.setVisible(false);
    }

    show(message) {
        this.text.setText(message);
        this.container.setVisible(true);
    }

    hide() {
        this.container.setVisible(false);
    }
}

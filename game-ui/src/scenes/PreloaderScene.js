import Phaser from 'phaser';

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('PreloaderScene');
    }

    preload() {
        // Load assets here
        // this.load.image('player', 'public/assets/sprites/player.png');
        // this.load.tilemapTiledJSON('map', 'public/assets/tilemaps/map.json');
    }

    create() {
        this.scene.start('GameScene');
    }
}

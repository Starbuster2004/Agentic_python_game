import Phaser from 'phaser';
import PreloaderScene from './scenes/PreloaderScene';
import GameScene from './scenes/GameScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [PreloaderScene, GameScene]
};

new Phaser.Game(config);

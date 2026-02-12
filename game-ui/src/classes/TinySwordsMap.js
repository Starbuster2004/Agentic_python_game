import Phaser from 'phaser';

/**
 * Renderer for the Tiny Swords custom map format.
 * The map JSON uses {id, x, y} tile entries per layer,
 * where 'id' is the sprite index in the spritesheet.
 */
export default class TinySwordsMap {
    constructor(scene, mapData, textureKey) {
        this.scene = scene;
        this.mapData = mapData;
        this.tileSize = mapData.tileSize || 64;
        this.mapWidth = mapData.mapWidth || 29;
        this.mapHeight = mapData.mapHeight || 16;
        this.textureKey = textureKey;

        // Collision group for physics
        this.colliders = scene.physics.add.staticGroup();

        this._render();
    }

    /** Width in pixels */
    get widthInPixels() { return this.mapWidth * this.tileSize; }
    /** Height in pixels */
    get heightInPixels() { return this.mapHeight * this.tileSize; }

    _render() {
        const layers = this.mapData.layers || [];

        // Render layers in order (Background first, decorations on top)
        // Reverse so Background renders first (it's last in the array)
        const renderOrder = [...layers].reverse();

        renderOrder.forEach((layer, layerIndex) => {
            const depth = layerIndex;
            const tiles = layer.tiles || [];

            tiles.forEach(tile => {
                const px = tile.x * this.tileSize + this.tileSize / 2;
                const py = tile.y * this.tileSize + this.tileSize / 2;
                const frameIndex = parseInt(tile.id);

                const sprite = this.scene.add.sprite(px, py, this.textureKey, frameIndex);
                sprite.setDepth(depth);

                // If this layer has colliders, add invisible physics bodies
                if (layer.collider) {
                    const body = this.colliders.create(px, py, null);
                    body.setVisible(false);
                    body.body.setSize(this.tileSize * 0.8, this.tileSize * 0.8);
                }
            });
        });
    }

    /**
     * Returns the static group to use with physics.add.collider()
     */
    getColliders() {
        return this.colliders;
    }
}

export class Pipe extends Phaser.Physics.Arcade.Sprite {
    constructor(params: { scene: Phaser.Scene, x: number, y: number, key: string, frame?: string | number }) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // Add the pipe to the scene
        params.scene.add.existing(this);

        // Enable physics on the pipe
        params.scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);

        // Set initial properties
        this.setScale(3);
        this.setOrigin(0, 0);

        // Ensure body is an instance of Arcade.Body and not StaticBody
        const body = this.body as Phaser.Physics.Arcade.StaticBody;
        body.setSize(20, 20);
        //   body.allowGravity = false; // Disable gravity for this specific object
    }
}
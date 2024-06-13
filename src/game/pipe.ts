export class Pipe extends Phaser.Physics.Arcade.Sprite {
  constructor(params: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    key: string;
    frame?: string | number;
  }) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    params.scene.add.existing(this);

    params.scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);

    this.setScale(2);
    this.setOrigin(0, 0);

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(20, 20);
    //   body.allowGravity = false;
  }
}

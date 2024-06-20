import Phaser from "phaser";

export class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(config: { scene: Phaser.Scene; x: number; y: number }) {
    super(config.scene, config.x, config.y, "coin");

    this.scene.add.existing(this);

    this.scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);

    this.setScale(1.5)
    this.setOrigin(0, 0);

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(20, 20);
  }
}

export class Pipe extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(true);
    (this.body as Phaser.Physics.Arcade.Body).allowGravity = false;
  }

  reset(x: number, y: number, frame: number) {
    this.setPosition(x, y);
    this.setFrame(frame);
    this.setActive(true);
    this.setVisible(true);
  }
}
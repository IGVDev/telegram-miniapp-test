export class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'coin');
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }

  reset(x: number, y: number): void {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
  }
}
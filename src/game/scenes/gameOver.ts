export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  create() {
    this.add
      .text(
        this.game.scale.width / 2,
        this.game.scale.height / 2 - 50,
        "Game Over\nTouch to Restart",
        {
          fontSize: "32px",
          color: "#fff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.input.on("pointerdown", () => {
      this.scene.start("MainScene");
    });
  }
}

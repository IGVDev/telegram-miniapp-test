export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  create() {
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 20,
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

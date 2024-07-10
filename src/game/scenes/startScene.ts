export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  create() {
    this.add.text(this.game.scale.width / 2, this.game.scale.height / 2 - 150, "FLY PATATA,", { fontSize: 40, color: "#fff", align: "center" }).setOrigin(0.5);
    this.add.text(this.game.scale.width / 2, this.game.scale.height / 2 - 100, "FLY...", { fontSize: 40, color: "#fff", align: "center" }).setOrigin(0.5);
    this.add.text(this.game.scale.width / 2, this.game.scale.height / 2, "Tap to start", { fontSize: 24, color: "#fff", align: "center" }).setOrigin(0.5);

    this.input.on("pointerdown", () => {
      this.scene.start("MainScene");
    });
  }
}

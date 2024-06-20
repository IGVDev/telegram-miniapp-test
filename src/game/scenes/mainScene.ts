import Phaser from "phaser";
import { Pipe } from "../pipe";
import { Coin } from "../coin";
import bgImage from "../../assets/bg.png";
import birdImage from "../../assets/bird.png";
import pipeImage from "../../assets/pipe.png";
import coinImage from "../../assets/coin.png";
import WebApp from "@twa-dev/sdk";

interface MainSceneConfig {
  onScoreUpdate?: (score: number) => void;
}

export default class MainScene extends Phaser.Scene {
  private bird!: Phaser.Physics.Arcade.Sprite;
  private pipes!: Phaser.Physics.Arcade.StaticGroup;
  private coins!: Phaser.Physics.Arcade.StaticGroup;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private onScoreUpdate?: (score: number) => void;
  private pipeCounter: number = 0;
  private isPaused: boolean = false;
  private clickCount: number = 0;
  private countdownValue: number = 3;
  private countdownText!: Phaser.GameObjects.Text;
  private savedVelocityY: number = 0;

  constructor(config: MainSceneConfig) {
    super("MainScene");
    this.onScoreUpdate = config.onScoreUpdate;
  }

  preload() {
    this.load.image("background", bgImage);
    this.load.image("bird", birdImage);
    this.load.image("coin", coinImage);
    this.load.spritesheet("pipe", pipeImage, {
      frameWidth: 20,
      frameHeight: 20,
    });
  }

  create() {
    this.bird = this.physics.add
      .sprite(100, this.scale.height / 4, "bird")
      .setScale(2.5);

    this.bird.setCollideWorldBounds(true);
    this.bird.setDepth(1);

    this.coins = this.physics.add.staticGroup({ classType: Coin });
    this.pipes = this.physics.add.staticGroup({ classType: Pipe });
    const background = this.add
      .tileSprite(0, 0, this.scale.width, this.scale.height, "background")
      .setOrigin(0, 0);
    background.setName("background");

    this.input.on("pointerdown", () => {
      if (!this.isPaused) {
        this.bird.setVelocityY(-500);
        this.tweens.add({
          targets: this.bird,
          props: { angle: -20 },
          duration: 150,
          ease: "Power0",
        });
      }
    });

    this.scoreText = this.add
      .text(16, 16, "Score: 0", {
        fontSize: "32px",
        color: "#000",
      })
      .setDepth(1);

    this.score = 0;
    this.scoreText.setText("Score: " + this.score);

    this.pipeCounter = 0;

    this.addNewRowOfPipes();

    this.countdownText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "", {
        fontSize: "40px",
        color: "#FF0000",
      })
      .setOrigin(0.5)
      .setDepth(2)
      .setVisible(false);

    this.time.addEvent({
      delay: 5000, // every X amount of time
      callback: this.pauseForClicks,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 1200,
      callback: () => {
        if (!this.isPaused) {
          this.addNewRowOfPipes();
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  update(_time, delta) {
    if (this.isPaused) {
      return;
    }
    const scrollSpeed = 0.2;

    const pixelsPerFrame = scrollSpeed * delta;

    const background = this.children.getByName(
      "background"
    ) as Phaser.GameObjects.TileSprite;
    if (background) {
      background.tilePositionX += pixelsPerFrame;
    }

    this.pipes.getChildren().forEach((pipe: Phaser.GameObjects.GameObject) => {
      const pipeSprite = pipe as Phaser.Physics.Arcade.Sprite;
      pipeSprite.x -= pixelsPerFrame;

      if (
        this.bird.x > pipeSprite.x &&
        !pipeSprite.getData("scored") &&
        !this.pipes
          .getChildren()
          .some(
            (p) =>
              p.getData("rowId") === pipeSprite.getData("rowId") &&
              p.getData("scored")
          )
      ) {
        // Mark all pipes in the row as scored
        this.pipes.getChildren().forEach((p) => {
          if (p.getData("rowId") === pipeSprite.getData("rowId")) {
            p.setData("scored", true);
          }
        });

        // Increase score
        this.score += 1;
        this.scoreText.setText("Score: " + this.score);
        this.onScoreUpdate?.(1);
      }

      // Remove pipes that go out of bounds
      if (pipeSprite.x + pipeSprite.displayWidth < 0) {
        this.pipes.killAndHide(pipeSprite);
        // this.pipes.remove(pipeSprite);
      }

      // Pipe collision
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.bird.getBounds(),
          pipeSprite.getBounds()
        )
      ) {
        this.scene.start("GameOverScene");
      }
    });

    this.coins.getChildren().forEach((coin) => {
      const coinSprite = coin as Phaser.Physics.Arcade.Sprite;
      coinSprite.x -= pixelsPerFrame;

      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.bird.getBounds(),
          coinSprite.getBounds()
        )
      ) {
        this.collectCoin(coinSprite);
      }
    });

    // Ground collision
    if (this.bird && this.bird.y >= this.scale.height - 18) {
      this.saveHighScore();
      this.scene.start("GameOverScene");
    }

    if (this.bird && this.bird.angle < 20) {
      this.bird.angle += 1;
    }
  }

  private pauseForClicks() {
    this.savedVelocityY = this.bird.body.velocity.y;
    this.physics.world.gravity.y = 0;
    this.bird.setVelocityY(0);
    this.bird.setAngle(0);

    this.isPaused = true;
    this.clickCount = 0;
    this.input.on("pointerdown", this.countClick, this);

    this.time.delayedCall(5000, this.startCountdown, [], this);
  }

  private countClick() {
    if (this.isPaused) {
      this.clickCount++;
    }
  }

  private startCountdown() {
    this.input.off("pointerdown", this.countClick, this);
    this.countdownValue = 3;
    this.countdownText.setVisible(true);
    this.countdown();
  }

  private countdown() {
    this.countdownText.setText(this.countdownValue.toString());
    if (this.countdownValue > 0) {
      this.time.delayedCall(
        1000,
        () => {
          this.countdownValue--;
          this.countdown();
        },
        [],
        this
      );
    } else {
      this.resumeGame();
    }
  }

  private resumeGame() {
    // Restore normal world gravity when the game resumes
    this.isPaused = false;
    this.physics.world.gravity.y = 2600; // Adjust this value to your game's normal gravity
    this.bird.setVelocityY(this.savedVelocityY);
    this.countdownText.setVisible(false);
    // Optionally save the click count or do something with it here
    console.log("Clicks during pause:", this.clickCount);
  }

  private collectCoin(coin: Phaser.Physics.Arcade.Sprite) {
    this.score += 30;
    this.scoreText.setText("Score: " + this.score);
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.score);
    }
    coin.destroy();
  }

  private spawnCoin(x: number, y: number) {
    const coin = new Coin({ scene: this, x, y });
    this.coins.add(coin);
  }

  private addNewRowOfPipes() {
    const hole = Math.floor(Math.random() * 5) + 1;
    const rowId = Date.now();
    for (let i = 0; i < 10; i++) {
      if (i !== hole && i !== hole + 1 && i !== hole + 2) {
        let frame;
        if (i === hole - 1) {
          frame = 0;
        } else if (i === hole + 3) {
          frame = 1;
        } else {
          frame = 2;
        }
        this.addPipe(400, i * 40, frame, rowId);
      }
    }
    this.pipeCounter++;

    if (this.pipeCounter % 5 === 0) {
      this.spawnCoin(400, (hole + 1) * 40); // Spawn the coin in the middle of the hole
    }
  }

  private addPipe(x: number, y: number, frame: number, rowId: number) {
    const pipe = new Pipe({ scene: this, x, y, frame, key: "pipe" });
    pipe.setData("rowId", rowId);
    this.pipes.add(pipe);
  }

  private async saveHighScore() {
    const highScore = Number(WebApp.CloudStorage.getItem("highScore")) || 0;
    if (highScore) {
      if (this.score > highScore) {
        WebApp.CloudStorage.setItem("highScore", this.score.toString());
      }
    } else {
      WebApp.CloudStorage.setItem("highScore", this.score.toString());
    }
  }
}

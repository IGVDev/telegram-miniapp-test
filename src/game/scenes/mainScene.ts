import Phaser from "phaser";
import { Pipe } from "../pipe";
import { Coin } from "../coin";
import bgImage from "../../assets/bg.png";
import birdImage from "../../assets/newBird.png";
import pipeImage from "../../assets/newPipe.png";
import coinImage from "../../assets/coin.png";
import openMouthBirdImage from "../../assets/open-mouth-birdpng.png";
import WebApp from "@twa-dev/sdk";
import axios from "axios";

interface MainSceneConfig {
  onScoreUpdate?: (score: number) => void;
  gameGravity: number;
  jumpStrength: number;
  scrollSpeed: number;
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
  private clickCountText!: Phaser.GameObjects.Text;
  private savedVelocityY: number = 0;
  private lastPauseScore: number = 0;
  private scoreMultiplier: number = 1;
  private scoreMultiplierText!: Phaser.GameObjects.Text;
  private totalPipesCleared: number = 0;
  private gameGravity: number;
  private jumpStrength: number;
  private scrollSpeed: number;
  // private pipeTimer!: Phaser.Time.TimerEvent;

  constructor(config: MainSceneConfig) {
    super("MainScene");
    this.onScoreUpdate = config.onScoreUpdate;
    this.gameGravity = config.gameGravity;
    this.jumpStrength = config.jumpStrength;
    this.scrollSpeed = config.scrollSpeed;
  }

  preload() {
    this.load.image("background", bgImage);
    this.load.image("openMouthBird", openMouthBirdImage);
    this.load.image("bird", birdImage);
    this.load.image("coin", coinImage);
    this.load.spritesheet("pipe", pipeImage, {
      frameWidth: 20,
      frameHeight: 20,
    });
  }

  create() {
    this.isPaused = false;
    this.scoreMultiplier = 1;
    this.totalPipesCleared = 0;
    this.clickCount = 0;
    this.lastPauseScore = 0;
    this.pipeCounter = 0;
    this.scrollSpeed = 0.15;

    this.clickCountText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "", {
        fontSize: "28px",
        color: "#FF0000",
        align: "center",
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(3);

    this.bird = this.physics.add
      .sprite(100, this.scale.height / 4, "bird")
      .setScale(0.3);

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
        this.bird.setVelocityY(-this.gameGravity * this.jumpStrength);
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
        color: "#FFF",
      })
      .setDepth(1);

    this.scoreMultiplierText = this.add
      .text(16, 48, "", {
        fontSize: "28px",
        color: "#FFF",
        align: "center",
      })
      .setDepth(3);

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
      delay: 1500,
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

    const pixelsPerFrame = this.scrollSpeed * delta;

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
        this.score += 1 * this.scoreMultiplier;
        if (this.pipeCounter % 5 === 0) {
          this.scrollSpeed += 0.02; // Increase scroll speed
          // this.resetPipeTimer(); // Reset the timer with new delay
        }
        this.totalPipesCleared++;
        this.scoreText.setText(`Score: ${this.formatScore(this.score)}`);
        this.onScoreUpdate?.(1);

        if (this.totalPipesCleared % 2 === 0) {
          this.scoreMultiplier += 0.1;
        }
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
        this.endGame(this.score);
      }

      if (this.canPauseGame()) {
        this.superClickScene();
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
      this.endGame(this.score);
    }

    if (this.bird && this.bird.angle < 20) {
      this.bird.angle += 1;
    }

    this.scoreMultiplierText.setText(
      this.formatScore(this.scoreMultiplier) + "x"
    );
  }

  private endGame(coinAmount: number) {
    this.onGameOver(coinAmount);
    this.scene.start("GameOverScene");
  }

  private onGameOver(amount: number) {
    const data = WebApp.initData;
    const params = new URLSearchParams(data);
    const hash = params.get("hash");
    const paramsJson = Object.fromEntries(params.entries());

    axios.post(
      "https://europe-west6-stage-music-backend.cloudfunctions.net/memecoin_user_add_score",
      {
        initData: paramsJson,
        tokens: amount,
      },
      {
        headers: {
          Authorization: `Bearer ${hash}`,
        },
      }
    );
  }

  private formatScore(score: number): string {
    return score % 1 === 0 ? score.toString() : score.toFixed(1);
  }

  private handleCoinSpawn = () => {
    const coinX = this.input.activePointer.worldX;
    const coinY = this.input.activePointer.worldY;
    const coin = this.physics.add
      .sprite(coinX, coinY, "coin")
      .setScale(8)
      .setDepth(4);
    this.tweens.add({
      targets: coin,
      x: 200,
      y: 360,
      scale: 0,
      duration: 500,
      ease: "Power2",
      onComplete: () => {
        coin.destroy();
      },
    });
  };

  private canPauseGame(): boolean {
    if (
      this.score % 5 === 0 &&
      this.score > 30 &&
      this.score - this.lastPauseScore >= 50
    ) {
      const safeDistance = 100; // Define a safe distance from the nearest pipe
      const nearestPipe = this.pipes.getChildren().reduce((nearest, pipe) => {
        const pipeSprite = pipe as Phaser.Physics.Arcade.Sprite;
        const nearestSprite = nearest as Phaser.Physics.Arcade.Sprite; // Cast nearest to Sprite
        return Math.abs(this.bird.x - pipeSprite.x) <
          Math.abs(this.bird.x - nearestSprite.x)
          ? pipeSprite
          : nearestSprite;
      }, this.pipes.getFirstAlive() as Phaser.Physics.Arcade.Sprite) as Phaser.Physics.Arcade.Sprite;

      if (Math.abs(this.bird.x - nearestPipe.x) > safeDistance) {
        this.lastPauseScore = this.score; // Update the score at last pause
        return true;
      }
    }
    return false;
  }

  private superClickScene() {
    this.savedVelocityY = this.bird.body.velocity.y;
    this.physics.world.gravity.y = 0;
    this.bird.setVelocityY(0);
    this.bird.setAngle(0);

    this.input.on("pointerdown", this.countClick, this);

    this.clickCountText
      .setText(`Click to eat coins!!!\nClicks: ${this.clickCount}`)
      .setDepth(5)
      .setPosition(200, 100);
    this.clickCountText.setVisible(true);

    this.isPaused = true;

    const background = this.children.getByName(
      "background"
    ) as Phaser.GameObjects.TileSprite;
    background.setAlpha(0.5);

    const openMouthBird = this.physics.add
      .sprite(80, 360, "openMouthBird")
      .setScale(3)
      .setAngle(-45);
    openMouthBird.setDepth(2);

    this.input.on("pointerdown", this.handleCoinSpawn);

    this.time.delayedCall(
      5000,
      () => {
        this.startCountdown();
        openMouthBird.destroy();
        this.input.off("pointerdown", this.handleCoinSpawn);
      },
      [],
      this
    );
  }

  private countClick() {
    if (this.isPaused) {
      this.score++;
      this.onScoreUpdate(1);
      this.clickCount++;
      this.clickCountText.setText(`Click \n to eat coins!!!`).setScale(1.5);
    }
  }

  private startCountdown() {
    this.clickCountText.setVisible(false);
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
    this.isPaused = false;
    this.physics.world.gravity.y = this.gameGravity;
    this.bird.setVelocityY(this.savedVelocityY);
    this.countdownText.setVisible(false);
    console.log("Clicks during pause:", this.clickCount);

    const background = this.children.getByName(
      "background"
    ) as Phaser.GameObjects.TileSprite;
    background.setAlpha(1);
  }

  private collectCoin(coin: Phaser.Physics.Arcade.Sprite) {
    this.score += 30;
    this.scoreText.setText(`Score: ${this.formatScore(this.score)}`);
    if (this.onScoreUpdate) {
      this.onScoreUpdate(30);
    }

    this.animateCoinCollection(coin.x, coin.y);

    coin.destroy();
  }

  private animateCoinCollection(startX: number, startY: number) {
    const endX = 350;
    const endY = 20;
    const coinSprite = this.add.sprite(startX, startY, "coin").setScale(4);

    this.tweens.add({
      targets: coinSprite,
      x: endX,
      y: endY,
      scale: 1,
      duration: 800,
      ease: "Power3",
      onComplete: () => {
        coinSprite.destroy(); // Clean up the sprite after animation
      },
    });
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

    const spawnChance = 1;
    if (this.pipeCounter % 3 === 0 && Math.random() < spawnChance) {
      this.spawnCoin(400, (hole + 1) * 40);
    }
  }

  // private resetPipeTimer() {
  //   if (this.pipeTimer) {
  //     this.pipeTimer.remove(false);
  //   }
  //   this.pipeTimer = this.time.addEvent({
  //     delay: 1500 - this.scrollSpeed * 100, // Adjust delay based on scroll speed
  //     callback: () => {
  //       if (!this.isPaused) {
  //         this.addNewRowOfPipes();
  //       }
  //     },
  //     callbackScope: this,
  //     loop: true,
  //   });
  // }

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

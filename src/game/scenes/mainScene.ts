import Phaser from "phaser";
import { Pipe } from "../pipe";
import { Coin } from "../coin";
import bgImage from "../../assets/bg.png";
// import birdImage from "../../assets/newBird.png";
import decorImage from "../../assets/decor.png";
import patataImage from "../../assets/patata.png";
import pipeImage from "../../assets/newPipe.png";
import coinImage from "../../assets/coin.png";
import openMouthPatataImage from "../../assets/open-mouth-patata.png";
import WebApp from "@twa-dev/sdk";
import axios from "axios";

interface MainSceneConfig {
  onScoreUpdate?: (score: number) => void;
  gameGravity: number;
  jumpStrength: number;
  scrollSpeed: number;
}

export default class MainScene extends Phaser.Scene {
  private patata!: Phaser.Physics.Arcade.Sprite;
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
  private distanceMoved: number = 0;
  private distanceThreshold: number = window.outerWidth;
  private fixedTimeStep: number = 1000 / 60;
  private accumulator: number = 0;
  private pipePool: Phaser.GameObjects.Group;
  private coinPool: Phaser.GameObjects.Group;
  private pipeValue: number = 10;
  private lastSuperClickTime: number = 0;
  private superClickCooldown: number = 20000;
  private decorInterval: number = 3;
  private recentlyUsedFrames: number[] = [];
  private totalDecorFrames: number = 8;

  constructor(config: MainSceneConfig) {
    super("MainScene");
    this.onScoreUpdate = config.onScoreUpdate;
    this.gameGravity = config.gameGravity;
    this.jumpStrength = config.jumpStrength;
    this.scrollSpeed = config.scrollSpeed;
  }

  preload() {
    this.load.image("background", bgImage);
    this.load.image("openMouthPatata", openMouthPatataImage);
    this.load.image("patata", patataImage);
    this.load.image("coin", coinImage);
    this.load.spritesheet("pipe", pipeImage, {
      frameWidth: 20,
      frameHeight: 20,
    });
    this.load.spritesheet("decor", decorImage, {
      frameWidth: 80,
      frameHeight: 80,
    });
  }

  create() {
    this.isPaused = false;
    this.scoreMultiplier = 1;
    this.totalPipesCleared = 0;
    this.clickCount = 0;
    this.lastPauseScore = 0;
    this.pipeCounter = 0;
    this.distanceMoved = 0;
    this.scrollSpeed = 0.15;
    this.distanceThreshold = window.outerWidth;

    this.clickCountText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "", {
        fontSize: "28px",
        color: "#FF0000",
        align: "center",
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(3);

    this.patata = this.physics.add
      .sprite(100, this.scale.height / 4, "patata")
      .setScale(0.35);

    this.patata.setCollideWorldBounds(true);
    this.patata.setDepth(1);

    this.pipePool = this.add.group({
      classType: Pipe,
      maxSize: 30,
      runChildUpdate: false,
      createCallback: (pipe: Pipe) => {
        pipe.setActive(false);
        pipe.setVisible(false);
      },
    });

    this.coinPool = this.add.group({
      classType: Coin,
      maxSize: 10,
      runChildUpdate: false,
      createCallback: (coin: Coin) => {
        coin.setActive(false);
        coin.setVisible(false);
      },
    });

    this.prespawnObjects();

    const background = this.add
      .tileSprite(0, 0, this.scale.width, this.scale.height, "background")
      .setOrigin(0, 0);
    background.setName("background");
    background.scrollFactorX = 2;

    this.input.on("pointerdown", () => {
      if (!this.isPaused) {
        if (this.patata.body.velocity.y > 0) {
          this.patata.body.velocity.y = 0;
        }

        this.patata.setVelocityY(
          this.patata.body.velocity.y / 2 - this.gameGravity * this.jumpStrength
        );
        this.tweens.add({
          targets: this.patata,
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
      .setDepth(3);

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
  }

  update(_time: number, delta: number) {
    if (this.isPaused) {
      return;
    }

    this.accumulator += delta;

    while (this.accumulator >= this.fixedTimeStep) {
      this.fixedUpdate(this.fixedTimeStep);
      this.accumulator -= this.fixedTimeStep;
    }

    // Frame-by-frame updates
    if (this.patata && this.patata.angle < 20) {
      this.patata.angle += 1;
    }
  }

  private fixedUpdate(fixedDelta: number) {
    const pixelsPerFrame = this.scrollSpeed * fixedDelta;
    this.distanceMoved += pixelsPerFrame;

    if (this.distanceMoved >= this.distanceThreshold) {
      this.addNewRowOfPipes();
      this.distanceMoved = 0;
    }

    const background = this.children.getByName(
      "background"
    ) as Phaser.GameObjects.TileSprite;
    if (background) {
      background.tilePositionX += pixelsPerFrame;
    }

    this.updatePipes(pixelsPerFrame);
    this.updateCoins(pixelsPerFrame);
    this.updatePipeDecor(pixelsPerFrame);

    // Ground collision
    if (this.patata && this.patata.y >= this.scale.height - 18) {
      this.saveHighScore();
      this.endGame(this.score);
    }
  }

  private prespawnObjects() {
    for (let i = 0; i < 30; i++) {
      const pipe = new Pipe(this, 0, 0, "pipe", 0);
      pipe.setActive(false);
      pipe.setVisible(false);
      this.pipePool.add(pipe);
    }
    for (let i = 0; i < 10; i++) {
      const coin = new Coin(this, 0, 0);
      coin.setActive(false);
      coin.setVisible(false);
      this.coinPool.add(coin);
    }
  }

  private updatePipes(pixelsPerFrame: number) {
    let scoreAdded = false;

    this.pipePool.children.entries.forEach(
      (pipe: Phaser.GameObjects.GameObject) => {
        const pipeSprite = pipe as Phaser.Physics.Arcade.Sprite;
        if (!pipeSprite.active) return;

        pipeSprite.x -= pixelsPerFrame;

        if (pipeSprite.x + pipeSprite.displayWidth < 0) {
          pipeSprite.setActive(false);
          pipeSprite.setVisible(false);
        }

        if (!scoreAdded && !pipeSprite.getData("scored")) {
          const rowId = pipeSprite.getData("rowId");
          const pipeSet = this.pipePool
            .getChildren()
            .filter(
              (p) => p.getData("rowId") === rowId
            ) as Phaser.Physics.Arcade.Sprite[];

          if (pipeSet.every((p) => this.patata.x > p.x + p.displayWidth)) {
            pipeSet.forEach((p) => p.setData("scored", true));
            this.score += this.pipeValue * this.scoreMultiplier;
            this.updateScore(this.pipeValue * this.scoreMultiplier);
            scoreAdded = true;
          }
        }

        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            this.patata.getBounds(),
            pipeSprite.getBounds()
          )
        ) {
          this.endGame(this.score);
        }
      }
    );

    if (this.canPauseGame()) {
      this.superClickScene();
    }
  }

  private updatePipeDecor(pixelsPerFrame: number) {
    this.pipePool.children.entries.forEach(
      (pipe: Phaser.GameObjects.GameObject) => {
        const pipeSprite = pipe as Phaser.Physics.Arcade.Sprite;
        if (!pipeSprite.active) return;

        const decor = pipeSprite.getData("decor") as Phaser.GameObjects.Image;
        if (decor) {
          decor.x -= pixelsPerFrame;

          if (decor.x + decor.width < 0) {
            decor.destroy();
            pipeSprite.setData("decor", null);
          }
        }
      }
    );
  }

  private updateCoins(pixelsPerFrame: number) {
    this.coinPool.children.entries.forEach(
      (coinObject: Phaser.GameObjects.GameObject) => {
        const coin = coinObject as Coin;
        if (!coin.active) return;
        coin.x -= pixelsPerFrame;

        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            this.patata.getBounds(),
            coin.getBounds()
          )
        ) {
          this.collectCoin(coin);
        }
      }
    );
  }

  private addOrReusePipe(x: number, y: number, frame: number, rowId: number) {
    let pipe = this.pipePool.get(
      x,
      y,
      "pipe",
      frame
    ) as Phaser.Physics.Arcade.Sprite;

    if (pipe) {
      pipe.setPosition(x, y);
      pipe.setFrame(frame);
    } else {
      pipe = this.physics.add.sprite(x, y, "pipe", frame);
      this.pipePool.add(pipe);
    }

    pipe.setData("rowId", rowId);
    pipe.setData("scored", false);
    pipe.setScale(3, this.scale.height / 200);
    pipe.setOrigin(0.5);
    pipe.setActive(true);
    pipe.setVisible(true);
    pipe.setDepth(1);

    return pipe;
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
      y: window.innerHeight - 200,
      scale: 0,
      duration: 500,
      ease: "Power2",
      onComplete: () => {
        coin.destroy();
      },
    });
  };

  private canPauseGame(): boolean {
    const currentTime = this.time.now;
    if (currentTime - this.lastSuperClickTime < this.superClickCooldown) {
      return false;
    }

    if (
      this.score % 150 === 0 &&
      this.score > 100 &&
      this.score - this.lastPauseScore >= 100
    ) {
      const safeDistance = 100;

      const activePipes = this.pipePool
        .getChildren()
        .filter((pipe) => pipe.active);

      if (activePipes.length === 0) {
        this.lastPauseScore = this.score;
        this.lastSuperClickTime = currentTime;
        return true;
      }

      const nearestPipe = activePipes.reduce((nearest, pipe) => {
        const pipeSprite = pipe as Phaser.Physics.Arcade.Sprite;
        const nearestSprite = nearest as Phaser.Physics.Arcade.Sprite;
        return Math.abs(this.patata.x - pipeSprite.x) <
          Math.abs(this.patata.x - nearestSprite.x)
          ? pipeSprite
          : nearestSprite;
      }, activePipes[0]) as Phaser.Physics.Arcade.Sprite;

      if (Math.abs(this.patata.x - nearestPipe.x) > safeDistance) {
        this.lastPauseScore = this.score;
        this.lastSuperClickTime = currentTime;
        return true;
      }
    }
    return false;
  }

  private superClickScene() {
    this.savedVelocityY = this.patata.body.velocity.y;
    this.physics.world.gravity.y = 0;
    this.patata.setVelocityY(0);
    this.patata.setAngle(0);

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

    const openMouthPatata = this.physics.add
      .sprite(80, window.innerHeight - 200, "openMouthPatata")
      .setScale(3)
      .setAngle(-45);
    openMouthPatata.setDepth(2);

    this.input.on("pointerdown", this.handleCoinSpawn);

    this.time.delayedCall(
      5000,
      () => {
        this.startCountdown();
        openMouthPatata.destroy();
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
    this.patata.setVelocityY(this.savedVelocityY);
    this.countdownText.setVisible(false);
    console.log("Clicks during pause:", this.clickCount);

    const background = this.children.getByName(
      "background"
    ) as Phaser.GameObjects.TileSprite;
    background.setAlpha(1);
  }

  private collectCoin(coin: Coin) {
    this.score += 30;
    this.updateScore(30);

    this.animateCoinCollection(coin.x, coin.y);

    coin.setActive(false);
    coin.setVisible(false);
  }

  private animateCoinCollection(startX: number, startY: number) {
    const endX = this.scale.width - 50;
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
        coinSprite.destroy();
      },
    });
  }

  private updateScore(points: number) {
    this.scoreText.setText(`Score: ${this.formatScore(this.score)}`);
    if (this.onScoreUpdate) {
      this.onScoreUpdate(points);
    }

    this.totalPipesCleared = Math.floor(this.score);

    if (this.totalPipesCleared % 5 === 0 && this.totalPipesCleared > 0) {
      this.scrollSpeed += 0.025;
      this.distanceThreshold = Math.max(this.distanceThreshold - 8, 100);
    }

    this.totalPipesCleared = Math.floor(this.score);
    if (this.totalPipesCleared % 2 === 0) {
      this.scoreMultiplier += 0.1;
      this.scoreMultiplierText.setText(
        this.formatScore(this.scoreMultiplier) + "x"
      );
    }
  }

  private spawnCoin(x: number, y: number) {
    let coin = this.coinPool.get(x, y) as Coin;

    if (!coin) {
      coin = new Coin(this, x, y);
      this.coinPool.add(coin);
    } else {
      coin.reset(x, y);
    }

    coin.setActive(true);
    coin.setVisible(true);
    coin.setDepth(1);
  }

  private addNewRowOfPipes() {
    const hole = Math.floor(Math.random() * 5) + 1;
    const rowId = Date.now();
    const pipeHeight = this.scale.height / 10;
    const totalPipes = 10;
    const pipeX = this.scale.width + 50;

    this.pipeCounter++;

    if (this.pipeCounter % this.decorInterval === 0) {
      // Determine the largest segment
      const topSegmentSize = hole - 1;
      const bottomSegmentSize = totalPipes - (hole + 3);

      let decorPipeIndex;
      if (topSegmentSize >= bottomSegmentSize && topSegmentSize > 1) {
        decorPipeIndex = Math.floor(topSegmentSize / 2);
      } else if (bottomSegmentSize > 1) {
        decorPipeIndex = hole + 3 + Math.floor(bottomSegmentSize / 2);
      }

      for (let i = 0; i < totalPipes; i++) {
        if (i !== hole && i !== hole + 1 && i !== hole + 2) {
          let y = i * pipeHeight + pipeHeight / 2;
          if (i === totalPipes - 1) {
            y = this.scale.height - pipeHeight / 2;
          }

          const pipe = this.addOrReusePipe(
            pipeX,
            y,
            this.getPipeFrame(i, hole),
            rowId
          );

          if (i === decorPipeIndex) {
            this.addPipeDecor(y, pipeHeight, pipeX, pipe);
          }
        }
      }
    } else {
      // Add pipes without decor
      for (let i = 0; i < totalPipes; i++) {
        if (i !== hole && i !== hole + 1 && i !== hole + 2) {
          let y = i * pipeHeight + pipeHeight / 2;
          if (i === totalPipes - 1) {
            y = this.scale.height - pipeHeight / 2;
          }
          this.addOrReusePipe(pipeX, y, this.getPipeFrame(i, hole), rowId);
        }
      }
    }

    const spawnChance = 0.25;
    if (Math.random() < spawnChance) {
      this.spawnCoin(pipeX, (hole + 1) * pipeHeight);
    }
  }

  private getPipeFrame(index: number, hole: number): number {
    if (index === hole - 1) return 0; // top cap
    if (index === hole + 3) return 1; // bottom cap
    return 2; // middle segment
  }

  private addPipeDecor(
    y: number,
    pipeHeight: number,
    pipeX: number,
    pipe: Phaser.Physics.Arcade.Sprite
  ): boolean {
    const safeMargin = 20;
    const minY = Math.max(safeMargin, y - pipeHeight / 2 + safeMargin);
    const maxY = Math.min(
      this.scale.height - safeMargin,
      y + pipeHeight / 2 - safeMargin
    );

    const decorY = Phaser.Math.Between(minY, maxY);

    // Get a frame that hasn't been recently used
    const randomFrame = this.getUniqueFrame();

    const decor = this.add
      .sprite(pipeX, decorY, "decor", randomFrame)
      .setScale(0.6)
      .setDepth(2);

    pipe.setData("decor", decor);
    return true;
  }

  private getUniqueFrame(): number {
    let availableFrames = Array.from(
      Array(this.totalDecorFrames).keys()
    ).filter((frame) => !this.recentlyUsedFrames.includes(frame));

    if (availableFrames.length === 0) {
      // If all frames have been used, remove the oldest one
      this.recentlyUsedFrames.shift();
      availableFrames = [this.recentlyUsedFrames[0]];
    }

    const randomFrame = Phaser.Math.RND.pick(availableFrames);

    this.recentlyUsedFrames.push(randomFrame);
    if (this.recentlyUsedFrames.length > 6) {
      this.recentlyUsedFrames.shift();
    }

    return randomFrame;
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

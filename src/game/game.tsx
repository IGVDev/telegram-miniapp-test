import Phaser from "phaser";
import React, { useEffect, useRef } from "react";
import { Pipe } from "./pipe";

interface FlappyBirdGameProps {
  width: number;
  height: number;
  birdImage: string;
  pipeImage: string;
  backgroundImage: string;
  domId: string;
}

const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({
  width,
  height,
  birdImage,
  pipeImage,
  backgroundImage,
  domId,
}) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  let score = 0;
  let scoreText: Phaser.GameObjects.Text;

  useEffect(() => {
    if (gameRef.current) return;

    let bird: Phaser.Physics.Arcade.Sprite;
    let pipes: Phaser.Physics.Arcade.StaticGroup;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width,
      height,
      parent: domId,
      scene: {
        preload,
        create,
        update,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 3000, x: 0 },
        },
      },
    };

    gameRef.current = new Phaser.Game(config);

    function preload(this: Phaser.Scene) {
      this.load.image("background", backgroundImage);
      this.load.image("bird", birdImage);
      this.load.spritesheet("pipe", pipeImage, {
        frameWidth: 20,
        frameHeight: 20,
      });
    }

    function create(this: Phaser.Scene) {
      const background = this.add
        .tileSprite(0, 0, width, height, "background")
        .setOrigin(0, 0);
      background.setName("background");

      bird = this.physics.add.sprite(100, height / 2, "bird").setScale(3);
      bird.setCollideWorldBounds(true);

      pipes = this.physics.add.staticGroup({ classType: Pipe });

      const handleJump = () => {
        bird.setVelocityY(-500);
      };

      this.input.on("pointerdown", handleJump);

      this.physics.add.collider(bird, pipes, () => {
        this.scene.restart();
      });

      scoreText = this.add.text(16, 16, "Score: 0", {
        fontSize: "32px",
        color: "#000",
      });

      score = 0;
      scoreText.setText("Score: " + score);
      // Add initial pipes
      addNewRowOfPipes(this);

      this.time.addEvent({
        delay: 1100,
        callback: () => addNewRowOfPipes(this),
        callbackScope: this,
        loop: true,
      });

      pipes.getChildren().forEach((pipe: Phaser.GameObjects.GameObject) => {
        pipe.setData("scored", false); // Reset scored status for each pipe
      });
    }

    const addNewRowOfPipes = (scene: Phaser.Scene): void => {
      // update the score
      // const score = this.registry.get('score') + 1;
      // this.registry.set('score', score);
      // this.scoreText.setText('Score: ' + score);

      // randomly pick a number between 1 and 5
      const hole = Math.floor(Math.random() * 5) + 1;

      // add 6 pipes with one big hole at position hole and hole + 1
      for (let i = 0; i < 10; i++) {
        if (i !== hole && i !== hole + 1 && i !== hole + 2) {
          if (i === hole - 1) {
            addPipe(scene, 400, i * 60, 0);
          } else if (i === hole + 3) {
            addPipe(scene, 400, i * 60, 1);
          } else {
            addPipe(scene, 400, i * 60, 2);
          }
        }
      }
    };

    const addPipe = (
      scene: Phaser.Scene,
      x: number,
      y: number,
      frame: number
    ): void => {
      pipes.add(new Pipe({ scene, x, y, frame, key: "pipe" }));
    };

    function update(this: Phaser.Scene) {
      const scrollSpeed = 3; // Adjust scroll speed as needed

      const background = this.children.getByName(
        "background"
      ) as Phaser.GameObjects.TileSprite;
      if (background) {
        background.tilePositionX += scrollSpeed;
      }

      pipes.getChildren().forEach((pipe: Phaser.GameObjects.GameObject) => {
        const pipeSprite = pipe as Phaser.Physics.Arcade.Sprite;
        pipeSprite.x -= scrollSpeed;

        if (bird.x > pipeSprite.x && !pipe.getData("scored")) {
          // Mark the pipe as scored to avoid double scoring
          pipe.setData("scored", true);

          // Increase score
          score += 1;
          scoreText.setText("Score: " + score / 7);
        }

        // Remove pipes that go out of bounds
        if (pipeSprite.x + pipeSprite.displayWidth < 0) {
          pipes.killAndHide(pipeSprite);
          pipes.remove(pipeSprite);
        }

        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            bird.getBounds(),
            pipeSprite.getBounds()
          )
        ) {
          this.scene.restart(); // Restart scene upon overlap
        }
      });

      if (bird && bird.y >= height - 18) {
        this.scene.restart();
      }

      if (bird && bird.angle < 20) {
        bird.angle += 1;
      }
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [width, height, birdImage, pipeImage, backgroundImage, domId]);

  return <div id={domId} />;
};

export default FlappyBirdGame;

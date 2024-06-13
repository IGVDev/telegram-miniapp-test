import Phaser from "phaser";
import React, { useEffect, useRef } from "react";
import { GameOverScene } from "./scenes/gameOver";
import MainScene from "./scenes/mainScene";

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

  useEffect(() => {
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width,
      height,
      parent: domId,
      scene: [MainScene, GameOverScene],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 3000, x: 0 },
        },
      },
    };

    gameRef.current = new Phaser.Game(config);

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

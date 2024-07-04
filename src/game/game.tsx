import Phaser from "phaser";
import React, { useEffect, useRef } from "react";
import GameOverScene from "./scenes/gameOver";
import MainScene from "./scenes/mainScene";
import StartScene from "./scenes/startScene";
import backgroundImage from "../assets/bg.png";
import pipeImage from "../assets/pipe.png";
import birdImage from "../assets/bird.png";

interface FlappyBirdGameProps {
  width: number;
  height: number;
  domId: string;
  onScoreUpdate?: (score: number) => void;
}

const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({
  width,
  height,
  domId,
  onScoreUpdate,
}) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const gameGravity = 1000;
  const jumpStrength = 0.33;
  const scrollSpeed = 0.15;

  useEffect(() => {
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight - 150,
      parent: domId,
      scene: [
        new StartScene(),
        new MainScene({
          onScoreUpdate,
          gameGravity,
          jumpStrength,
          scrollSpeed,
        }),
        new GameOverScene(),
      ],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: gameGravity, x: 0 },
          fixedStep: true,
          fps: 300,
          debug: true,
          debugShowBody: true,
          debugShowStaticBody: true,
          debugShowVelocity: true,
        },
      },
      pixelArt: true,
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [width, height, birdImage, pipeImage, backgroundImage, domId]);

  return (
    <div
      id={domId}
      style={{ borderBottomLeftRadius: "20px", borderBottomRightRadius: "20px", overflow: "hidden" }}
    />
  );
};

export default FlappyBirdGame;

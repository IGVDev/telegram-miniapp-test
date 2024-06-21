import { Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FlappyBirdGame from "../game/game";
import coinImg from "../assets/coin.png";
import WebApp from "@twa-dev/sdk";

export const Tap = () => {
  const [coins, setCoins] = useState(0);

  const handleScoreUpdate = (x: number) => {
    setCoins((prevCoins) => prevCoins + x);
  };

  useEffect(() => {
    WebApp.CloudStorage.getItem("coins", (error, result) => {
      if (error) {
        console.error(error);
      } else {
        setCoins(Number(result));
      }
    });
  }, []);

  useEffect(() => {
    WebApp.CloudStorage.setItem("coins", coins.toString(), (error, result) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
      }
    });
  }, [coins]);

  return (
    <>
      <Flex className="gameContainer" position={"relative"} w={400} h={400}>
        <Flex
          className="coinContainer"
          align="center"
          position={"absolute"}
          right={2}
          gap={1}
        >
          {/* <RiCopperCoinFill size="50px" color="orange" /> */}
          <Image src={coinImg} height={12} width={8} />
          <Flex align="center">
            <Text fontSize="40px" fontWeight="bold" color="white">
              {coins}
            </Text>
          </Flex>
        </Flex>
        <FlappyBirdGame
          width={400}
          height={400}
          onScoreUpdate={handleScoreUpdate}
          domId="flappy-bird-game"
        />
      </Flex>
    </>
  );
};

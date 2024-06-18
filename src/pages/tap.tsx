import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RiCopperCoinFill } from "react-icons/ri";
import FlappyBirdGame from "../game/game";
import WebApp from "@twa-dev/sdk";

export const Tap = () => {
  const [coins, setCoins] = useState(0);

  const handleScoreUpdate = () => {
    setCoins((prevCoins) => prevCoins + 1);
  };

  // useEffect(() => {
  //   WebApp.CloudStorage.getItem("coins", (error, result) => {
  //     if (error) {
  //       console.error(error);
  //     } else {
  //       setCoins(Number(result));
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   WebApp.CloudStorage.setItem("coins", coins.toString(), (error, result) => {
  //     if (error) {
  //       console.error(error);
  //     } else {
  //       console.log(result);
  //     }
  //   });
  // }, [coins]);

  return (
    <Flex flexDir="column" w="100%" alignItems="center" gap={4} mt={2} pb={2} h="100vh">
      <Flex className="coinContainer" align="center" gap={1}>
        <RiCopperCoinFill size="50px" color="orange" />
        <Flex align="center">
          <Text fontSize="40px" fontWeight="bold" color="white">
            {coins}
          </Text>
        </Flex>
      </Flex>
      <Flex className="gameContainer">
        <FlappyBirdGame
          width={400}
          height={400}
          onScoreUpdate={handleScoreUpdate}
          domId="flappy-bird-game"
        />
      </Flex>
    </Flex>
  );
};

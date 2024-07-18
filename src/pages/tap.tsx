import { Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FlappyBirdGame from "../game/game";
import coinImg from "../assets/coin.png";
import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
import ReactGA from "react-ga4";

interface UserData {
  tokens: number;
}

export const Tap = () => {
  const [coins, setCoins] = useState(0);

  const handleScoreUpdate = (x: number) => {
    setCoins((prevCoins) => prevCoins + x);
  };

  const { data } = useQuery<UserData>({
    queryKey: ["login"],
  });

  useEffect(() => {
    if (data) {
      setCoins(data.tokens);
    }
  }, [data]);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/game" });
  }, []);

  return (
    <>
      <Flex
        className="gameContainer"
        position={"relative"}
        w={window.outerWidth}
        h={window.innerHeight - 120}
        minH={window.innerHeight - 120}
        // bgColor="red"
      >
        <Flex
          className="coinContainer"
          align="center"
          position={"absolute"}
          right={0}
          gap={1}
          bgColor="white"
          borderRadius={18}
          borderTopRadius={0}
          borderBottomRightRadius={0}
          p={2}
        >
          {/* <RiCopperCoinFill size="50px" color="orange" /> */}
          <Image src={coinImg} height={8} width={6} />
          <Flex align="center">
            <Text fontSize="20px" fontWeight="bold" color="black">
              {coins}
            </Text>
          </Flex>
        </Flex>
        <FlappyBirdGame
          width={window.outerWidth}
          height={window.innerHeight}
          onScoreUpdate={handleScoreUpdate}
          domId="flappy-bird-game"
        />
      </Flex>
    </>
  );
};

import { Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState, useCallback, useMemo } from "react";
import FlappyBirdGame from "../game/game";
import coinImg from "../assets/coin.png";
import { useQuery } from "@tanstack/react-query";
import ReactGA from "react-ga4";

interface UserData {
  tokens: number;
}

export const Tap = () => {
  const [coins, setCoins] = useState(0);

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

  const handleScoreUpdate = useCallback((x: number) => {
    setCoins((prevCoins) => prevCoins + x);
  }, []);

  const gameContainerStyle = useMemo(
    () => ({
      width: window.outerWidth,
      height: window.innerHeight - 120,
      minHeight: window.innerHeight - 120,
    }),
    []
  );

  const CoinDisplay = useMemo(
    () => (
      <Flex
        className="coinContainer"
        align="center"
        position="absolute"
        right={0}
        gap={1}
        bgColor="white"
        borderRadius={18}
        borderTopRadius={0}
        borderBottomRightRadius={0}
        p={2}
      >
        <Image src={coinImg} height={8} width={6} />
        <Flex align="center">
          <Text fontSize="20px" fontWeight="bold" color="black">
            {coins}
          </Text>
        </Flex>
      </Flex>
    ),
    [coins]
  );

  return (
    <Flex className="gameContainer" position="relative" {...gameContainerStyle}>
      {CoinDisplay}
      <FlappyBirdGame
        width={window.outerWidth}
        height={window.innerHeight}
        onScoreUpdate={handleScoreUpdate}
        domId="flappy-bird-game"
      />
    </Flex>
  );
};

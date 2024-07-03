import { Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FlappyBirdGame from "../game/game";
import coinImg from "../assets/coin.png";
import WebApp from "@twa-dev/sdk";
import { verifyTelegramWebAppData } from "../utils";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

export const Tap = () => {
  const [coins, setCoins] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleScoreUpdate = (x: number) => {
    setCoins((prevCoins) => prevCoins + x);
  };

  const { data } = useQuery({
    queryKey: ["login"],
  });

  console.log(data);

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

  useEffect(() => {
    if (loggedIn) return;
    const data = WebApp.initData;

    if (verifyTelegramWebAppData(data)) {
      const params = new URLSearchParams(data);
      const hash = params.get("hash");
      const start_param = params.get("start_param");
      const paramsJson = Object.fromEntries(params.entries());
      axios.post(
        `https://europe-west6-stage-music-backend.cloudfunctions.net/memecoin_user_login`,
        {
          initData: paramsJson,
          referrer_uid: start_param,
        },
        {
          headers: {
            Authorization: "Bearer " + hash,
          },
        }
      );
      setLoggedIn(true);
    }
  }, [loggedIn]);

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
          borderTopLeftRadius={0}
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

import { Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FlappyBirdGame from "../game/game";
import coinImg from "../assets/coin.png";
import WebApp from "@twa-dev/sdk";
import { verifyTelegramWebAppData } from "../utils";
// import axios from "axios";

export const Tap = () => {
  const [coins, setCoins] = useState(0);

  const handleScoreUpdate = (x: number) => {
    setCoins((prevCoins) => prevCoins + x);
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

  useEffect(() => {
    const data = WebApp.initData;

    if (verifyTelegramWebAppData(data)) {
      const params = new URLSearchParams(data);
      // const id = extractUserId(data);
      console.log(params);
      const hash = params.get("hash");
      const start_param = params.get("start");
      // axios.post(
      //   `https://europe-west6-stage-music-backend.cloudfunctions.net/memecoin_user_login`,
      //   {
      //     referrer_uid:
      //   }
      // );
      console.log(start_param, hash);
    }
  }, []);

  return (
    <>
      <Flex
        className="gameContainer"
        position={"relative"}
        w={400}
        h={400}
        minH={400}
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
          width={400}
          height={400}
          onScoreUpdate={handleScoreUpdate}
          domId="flappy-bird-game"
        />
      </Flex>
    </>
  );
};

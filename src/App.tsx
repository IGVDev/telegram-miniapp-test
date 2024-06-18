import "./App.css";

import FlappyBirdGame from "./game/game";
import bgImage from "./assets/bg.png";
import pipeImage from "./assets/pipe.png";
import birdImage from "./assets/bird.png";
import appBg from "./assets/background.webp";
import { RiBarChartFill, RiCopperCoinFill, RiHeartsFill } from "react-icons/ri";
import { Flex, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import CryptoJS from "crypto-js";

enum TabIndex {
  Ref = 0,
  Tap = 1,
  Leaderboard = 2,
}

function App() {
  const [coins, setCoins] = useState(0);
  const [activeTab, setActiveTab] = useState<TabIndex>(TabIndex.Tap);

  //Refs
  const [refCount] = useState(0);
  const [userId, setUserId] = useState("");

  const handleScoreUpdate = () => {
    setCoins((prevCoins) => prevCoins + 1);
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

  useEffect(() => {
    WebApp.ready();

    const verifyTelegramWebAppData = async (
      telegramInitData: string
    ): Promise<boolean> => {
      const initData = new URLSearchParams(telegramInitData);
      const hash = initData.get("hash");
      const dataToCheck: string[] = [];

      initData.sort();
      initData.forEach(
        (val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`)
      );

      const secret = CryptoJS.HmacSHA256(
        import.meta.env.VITE_BOT_TOKEN,
        "WebAppData"
      );
      const _hash = CryptoJS.HmacSHA256(
        dataToCheck.join("\n"),
        secret
      ).toString(CryptoJS.enc.Hex);

      return _hash === hash;
    };

    const extractUserId = (initData) => {
      if (!initData) return;

      const params = new URLSearchParams(initData);
      const user = params.get("user");
      if (!user) return;
      const userData = JSON.parse(user);
      return userData.id;
    };

    if (WebApp.initData) {
      console.log("initData", WebApp.initData);
      const data = WebApp.initData;

      if (verifyTelegramWebAppData(data)) {
        const id = extractUserId(data);
        setUserId(id);
      } else {
        console.error("Invalid initData signature.");
      }
    }
  }, []);

  return (
    <Flex
      className="App"
      bgImage={appBg}
      bgSize="cover"
      bgPosition="center"
      height="100vh"
    >
      <Flex
        className="mainContainer"
        flexDir="column"
        alignItems="center"
        w="100%"
        gap={4}
        mt={2}
      >
        {activeTab === TabIndex.Ref && (
          <Flex
            className="refContainer"
            flexDir="column"
            align="center"
            gap={2}
          >
            <Text fontSize="40px" fontWeight="bold" color="white">
              {refCount} Referrals
            </Text>

            <Flex
              bgColor="whiteAlpha.300"
              w="100%"
              position="relative"
              flexDir="column"
            >
              <Text>My invite link:</Text>
              <Text>https://t.me/testatrbot?ref={userId}</Text>
            </Flex>
          </Flex>
        )}
        {activeTab === TabIndex.Tap && (
          <>
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
                birdImage={birdImage}
                pipeImage={pipeImage}
                backgroundImage={bgImage}
                onScoreUpdate={handleScoreUpdate}
                domId="flappy-bird-game"
              />
            </Flex>
          </>
        )}
        {activeTab === TabIndex.Leaderboard && <div>Leaderboard</div>}
        <Flex className="tabsContainer">
          <Tabs
            variant="soft-rounded"
            isFitted
            colorScheme="yellow"
            defaultIndex={1}
            onChange={(index) => setActiveTab(index as TabIndex)}
          >
            <TabList gap="12px" height="80px">
              <Tab
                borderRadius={16}
                border="1px solid gray"
                _selected={{
                  border: "1px solid orange",
                  pointerEvents: "none",
                  bgColor: "rgba(255, 255, 0, 0.15)",
                }}
                bgColor="whiteAlpha.300"
              >
                <Flex flexDir="column" align="center" gap={1} color="white">
                  <RiHeartsFill size="30px" />
                  <Text fontSize="xs">Ref</Text>
                </Flex>
              </Tab>
              <Tab
                borderRadius={16}
                _selected={{
                  border: "1px solid orange",
                  pointerEvents: "none",
                  bgColor: "rgba(255, 255, 0, 0.15)",
                }}
                bgColor="whiteAlpha.300"
              >
                <Flex flexDir="column" align="center" gap={1} color="white">
                  <RiCopperCoinFill size="30px" />
                  <Text fontSize="xs">Tap</Text>
                </Flex>
              </Tab>
              <Tab
                borderRadius={16}
                border="1px solid gray"
                _selected={{
                  border: "1px solid orange",
                  pointerEvents: "none",
                  bgColor: "rgba(255, 255, 0, 0.15)",
                }}
                bgColor="whiteAlpha.300"
              >
                <Flex flexDir="column" align="center" gap={1} color="white">
                  <RiBarChartFill size="30px" />
                  <Text fontSize="xs">Scores</Text>
                </Flex>
              </Tab>
            </TabList>
          </Tabs>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default App;

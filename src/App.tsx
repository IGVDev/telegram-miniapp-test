import "./App.css";

import FlappyBirdGame from "./game/game";
import bgImage from "./assets/bg.png";
import pipeImage from "./assets/pipe.png";
import birdImage from "./assets/bird.png";
import appBg from "./assets/background.webp";
import {
  RiBarChartFill,
  RiCheckboxCircleFill,
  RiCopperCoinFill,
  RiFireFill,
  RiHeartsFill,
} from "react-icons/ri";
import { Flex, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

function App() {
  const [coins, setCoins] = useState(0);

  const handleScoreUpdate = () => {
    setCoins((prevCoins) => prevCoins + 1);
    WebApp.CloudStorage.setItem("coins", coins.toString(), (error, result) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
      }
    });
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
        <Flex className="tabsContainer">
          <Tabs variant="soft-rounded" colorScheme="yellow" defaultIndex={2}>
            <TabList gap="12px" height="80px">
              <Tab
                isDisabled
                borderRadius={16}
                border="1px solid gray"
                bgColor="whiteAlpha.300"
              >
                <Flex flexDir="column" align="center" gap={1} color="white">
                  <RiHeartsFill size="30px" />
                  <Text fontSize="xs">Ref</Text>
                </Flex>
              </Tab>
              <Tab
                isDisabled
                borderRadius={16}
                border="1px solid gray"
                bgColor="whiteAlpha.300"
              >
                <Flex flexDir="column" align="center" gap={1} color="white">
                  <RiCheckboxCircleFill size="30px" />
                  <Text fontSize="xs">Task</Text>
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
                isDisabled
                borderRadius={16}
                border="1px solid gray"
                bgColor="whiteAlpha.300"
              >
                <Flex flexDir="column" align="center" gap={1} color="white">
                  <RiFireFill size="30px" />
                  <Text fontSize="xs">Boost</Text>
                </Flex>
              </Tab>
              <Tab
                isDisabled
                borderRadius={16}
                border="1px solid gray"
                bgColor="whiteAlpha.300"
              >
                <Flex flexDir="column" align="center" gap={1} color="white">
                  <RiBarChartFill size="30px" />
                  <Text fontSize="xs">Stats</Text>
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

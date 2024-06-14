import "./App.css";

import FlappyBirdGame from "./game/game";
import bgImage from "./assets/bg.png";
import pipeImage from "./assets/pipe.png";
import birdImage from "./assets/bird.png";
import {
  RiBarChartFill,
  RiCheckboxCircleFill,
  RiCopperCoinFill,
  RiFireFill,
  RiHeartsFill,
} from "react-icons/ri";
import { Flex, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import { useState } from "react";

function App() {
  let [coins, setCoins] = useState(0);

  const handleGameOver = (score: number) => {
    console.log("Game Over! Score:", score);
  };

  return (
    <Flex className="App">
      <Flex
        className="mainContainer"
        flexDir="column"
        alignItems="center"
        w="100%"
      >
        <Flex className="coinContainer" align="center" gap={1} bgColor="red">
          <RiCopperCoinFill size="50px" />
          <Flex align="center" bgColor="yellow">
            <Text fontSize="40px" fontWeight="bold">
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
            onGameOver={handleGameOver}
            domId="flappy-bird-game"
          />
        </Flex>
        <Flex className="tabsContainer">
          <Tabs variant="soft-rounded" defaultIndex={2}>
            <TabList gap="20px" height="80px">
              <Tab isDisabled>
                <Flex flexDir="column" align="center" gap={1}>
                  <RiHeartsFill size="30px" />
                  <Text fontSize="xs">Ref</Text>
                </Flex>
              </Tab>
              <Tab isDisabled>
                <Flex flexDir="column" align="center" gap={1}>
                  <RiCheckboxCircleFill size="30px" />
                  <Text fontSize="xs">Task</Text>
                </Flex>
              </Tab>
              <Tab borderRadius={16}>
                <Flex flexDir="column" align="center" gap={1}>
                  <RiCopperCoinFill size="30px" />
                  <Text fontSize="xs">Tap</Text>
                </Flex>
              </Tab>
              <Tab isDisabled>
                <Flex flexDir="column" align="center" gap={1}>
                  <RiFireFill size="30px" />
                  <Text fontSize="xs">Boost</Text>
                </Flex>
              </Tab>
              <Tab isDisabled>
                <Flex flexDir="column" align="center" gap={1}>
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

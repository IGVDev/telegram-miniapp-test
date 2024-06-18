import "./App.css";

import appBg from "./assets/background.webp";
import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Ref } from "./pages/ref";
import { Tap } from "./pages/tap";
import { Navigation } from "./components/navigation";
import { Leaderboard } from "./pages/leaderboard";

enum TabIndex {
  Ref = 0,
  Tap = 1,
  Leaderboard = 2,
}

function App() {
  const [activeTab, setActiveTab] = useState<TabIndex>(TabIndex.Tap);

  return (
    <Flex
      className="App"
      bgImage={appBg}
      bgSize="cover"
      bgPosition="center"
      bgAttachment={"fixed"}
    >
      <Flex
        className="mainContainer"
        flexDir={"column"}
      >
        {activeTab === TabIndex.Ref && <Ref />}
        {activeTab === TabIndex.Tap && <Tap />}
        {activeTab === TabIndex.Leaderboard && <Leaderboard />}
        <Flex flex="1" align="end">
          <Flex className="tabsContainer" justify="center" mb={4}>
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default App;

import "./App.css";

import appBg from "./assets/background.webp";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (
      /android/i.test(userAgent) ||
      (/iPad|iPhone|iPod/.test(userAgent))
    ) {
      setIsMobile(true);
    }
  }, []);

  return (
    <Flex
      className="App"
      bgImage={appBg}
      bgSize="cover"
      bgPosition="center"
      height="100vh"
      overflowY="auto"
    >
      <Flex
        className="mainContainer"
        flexDir="column"
        w="100%"
        alignItems="center"
        gap={4}
        // mt={2}
      >
        {!isMobile ? (
          <Flex flex="1" align="center" justify="center" color="white">
            Please use a mobile device to access this application.
          </Flex>
        ) : (
          <>
            {activeTab === TabIndex.Ref && <Ref />}
            {activeTab === TabIndex.Tap && <Tap />}
            {activeTab === TabIndex.Leaderboard && <Leaderboard />}
            <Flex flex="1" align="end">
              <Flex className="tabsContainer" justify="center" mb={2}>
                <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
              </Flex>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
}

export default App;

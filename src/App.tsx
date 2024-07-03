import "./App.css";

import appBg from "./assets/background.webp";
import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Ref } from "./pages/ref";
import { Tap } from "./pages/tap";
import { Navigation } from "./components/navigation";
import { Leaderboard } from "./pages/leaderboard";
import { Tasks } from "./pages/tasks";
import WebApp from "@twa-dev/sdk";
import { verifyTelegramWebAppData } from "./utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

enum TabIndex {
  Ref = 0,
  Tasks = 1,
  Tap = 2,
  Leaderboard = 3,
}

function App() {
  const [activeTab, setActiveTab] = useState<TabIndex>(TabIndex.Tap);
  const [isMobile] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  // useEffect(() => {
  //   const userAgent = navigator.userAgent || navigator.vendor;
  //   if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
  //     setIsMobile(true);
  //   }
  // }, []);

  const initData = WebApp.initData;

  const handleLogin = async () => {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    const start_param = params.get("start_param");
    const paramsJson = Object.fromEntries(params.entries());

    if (!verifyTelegramWebAppData(initData)) {
      throw new Error("Invalid init data");
    }

    const { data } = await axios.post(
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

    return data;
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["login"],
    queryFn: handleLogin,
    enabled: !loggedIn,
  });

  useEffect(() => {
    if (data && !isError && !isLoading) {
      setLoggedIn(true);
    }
  }, [data, isError, isLoading]);

  return (
    <Flex
      className="App"
      bgImage={appBg}
      bgSize="cover"
      bgPosition="center"
      height="100vh"
      overflowY="auto"
    >
      {isLoading && (
        <Flex justify="center" align="center" height="100vh">
          <Spinner size="xl" color="white" />
        </Flex>
      )}
      {isError && <Flex color="white">Error: {error.message}</Flex>}
      {!isLoading && !isError && (
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
              {activeTab === TabIndex.Tasks && <Tasks />}
              {activeTab === TabIndex.Tap && <Tap />}
              {activeTab === TabIndex.Leaderboard && <Leaderboard />}
              <Flex flex="1" align="end">
                <Flex className="tabsContainer" justify="center" mb={2}>
                  <Navigation
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                </Flex>
              </Flex>
            </>
          )}
        </Flex>
      )}
    </Flex>
  );
}

export default App;

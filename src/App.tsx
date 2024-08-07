import "./App.css";

import appBg from "./assets/background.webp";
import { Flex, Image, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Ref } from "./pages/ref";
import { Tap } from "./pages/tap";
import { Navigation } from "./components/navigation";
import { Leaderboard } from "./pages/leaderboard";
import { Tasks } from "./pages/tasks";
import WebApp from "@twa-dev/sdk";
import { useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import qrCode from "./assets/qr-code.png";
import { usePreventSwipeDown } from "./hooks/usePreventSwipeDown";

enum TabIndex {
  Ref = 0,
  Tasks = 1,
  Tap = 2,
  Leaderboard = 3,
}

function App() {
  const [activeTab, setActiveTab] = useState<TabIndex>(TabIndex.Tap);
  const [isMobile, setIsMobile] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [, setClickCount] = useState(0);

  const scrollableElRef = usePreventSwipeDown();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (!/android/i.test(userAgent) && !/iPad|iPhone|iPod/.test(userAgent)) {
      setIsMobile(false);
    }
  }, []);

  const initData = WebApp.initData;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  const start_param = params.get("start_param");
  const paramsJson = Object.fromEntries(params.entries());
  // const [, setClickCount] = useState(0);

  // Just for debugging. Allows to enter the app from the desktop version.
  const handleClick = () => {
    setClickCount((prev) => {
      if (prev + 1 === 6) {
        setIsMobile(true);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleLogin = async () => {
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

  const handleTasks = async () => {
    const { data } = await axios.post(
      `https://europe-west6-stage-music-backend.cloudfunctions.net/memecoin_user_tasks`,
      {
        initData: paramsJson,
      },
      {
        headers: {
          Authorization: `Bearer ${hash}`,
        },
      }
    );

    return data;
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["login"],
    queryFn: handleLogin,
    enabled: !!loggedIn,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const queries = useQueries({
    queries: [
      {
        queryKey: ["tasks"],
        queryFn: handleTasks,
        enabled: !!loggedIn,
        staleTime: Infinity,
        refetchOnMount: false,
      },
      {
        queryKey: ["leaderboard"],
        queryFn: () =>
          axios.post(
            `https://europe-west6-stage-music-backend.cloudfunctions.net/memecoin_user_ranking`,
            { initData: paramsJson },
            { headers: { Authorization: `Bearer ${hash}` } }
          ),
        enabled: !!loggedIn,
        staleTime: Infinity,
        refetchOnMount: false,
      },
    ],
  });

  queries.forEach((query) => {
    if (query.isError) {
      console.error(query.error);
    }
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
      ref={scrollableElRef}
    >
      {!isMobile && (
        <Flex
          flex="1"
          align="center"
          justify="center"
          color="white"
          flexDir="column"
          gap={2}
          onClick={handleClick}
        >
          Please use a mobile device to access this application.
          <Image src={qrCode} alt="QR Code" h="200px" borderRadius={20} />
        </Flex>
      )}
      {isMobile && isLoading && (
        <Flex justify="center" align="center" height="100vh" w="100vw">
          <Spinner size="xl" color="white" />
        </Flex>
      )}
      {isMobile && !isLoading && isError && (
        <Flex color="white">Error: {error.message}</Flex>
      )}
      {isMobile && !isLoading && !isError && (
        <Flex
          className="mainContainer scrollable-content"
          flexDir="column"
          w="100%"
          alignItems="center"
          gap={4}
          // mt={2}
        >
          <>
            {activeTab === TabIndex.Ref && <Ref />}
            {activeTab === TabIndex.Tasks && <Tasks />}
            {activeTab === TabIndex.Tap && <Tap />}
            {activeTab === TabIndex.Leaderboard && <Leaderboard />}
            <Flex flex="1" align="end">
              <Flex className="tabsContainer" justify="center" mb={2}>
                <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
              </Flex>
            </Flex>
          </>
        </Flex>
      )}
    </Flex>
  );
}

export default App;

import { Flex, Tab, TabList, Tabs, Text, keyframes } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  RiBarChartFill,
  RiCheckboxFill,
  RiCopperCoinFill,
  RiHeartsFill,
} from "react-icons/ri";

interface QueryData {
  avatar_photo: string;
  first_name: string;
  language_code: string;
  last_name: string;
  referrals: { [key: string]: number };
  referred_by: null | string;
  source: string;
  tasks_completed: {
    [key: string]: {
      time: string;
      timestamp: number;
    };
  };
  timestamp_last_activity: number;
  timestamp_last_login: number;
  tokens: number;
  uid: string;
  username: string;
  n_logins?: number;
}

const bounceAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

export const Navigation = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: (index: number) => void;
}) => {
  const [hasVisitedRef, setHasVisitedRef] = useState(true);

  const { data, isLoading } = useQuery<QueryData>({
    queryKey: ["login"],
  });

  useEffect(() => {
    if (data?.n_logins === 1 && data?.tokens === 0) {
      setHasVisitedRef(false);
    }

    if (activeTab === 0 || data?.n_logins > 1 || data?.tokens > 1) {
      setHasVisitedRef(true);
    }
  }, [data, activeTab]);

  return (
    <Tabs
      variant="soft-rounded"
      isFitted
      w={{ base: "100vw", md: "40vw" }}
      p={2}
      defaultIndex={activeTab}
      onChange={(index) => setActiveTab(index)}
    >
      <TabList gap="8px" height="80px">
        <Tab
          borderRadius={16}
          border="1px solid gray"
          _selected={{
            border: "1px solid orange",
            pointerEvents: "none",
            bgColor: "rgba(255, 255, 0, 0.15)",
          }}
          bgColor="whiteAlpha.300"
          position="relative"
        >
          <Flex flexDir="column" align="center" gap={1} color="white">
            <RiHeartsFill size="30px" />
            <Text fontSize="xs">Ref</Text>
          </Flex>
          {activeTab !== 0 && !hasVisitedRef && !isLoading && (
            <Text
              position="absolute"
              top="-50px"
              fontSize="40px"
              animation={`${bounceAnimation} .75s ease-in-out infinite`}
            >
              👇
            </Text>
          )}
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
            <RiCheckboxFill size="30px" />
            <Text fontSize="xs">Tasks</Text>
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
            <Text fontSize="xs">
              Leader
              <br />
              board
            </Text>
          </Flex>
        </Tab>
      </TabList>
    </Tabs>
  );
};

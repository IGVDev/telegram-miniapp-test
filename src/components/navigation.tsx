import { Flex, Tab, TabList, Tabs, Text, keyframes } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  RiBarChartFill,
  RiCheckboxFill,
  RiCopperCoinFill,
  RiHeartsFill,
} from "react-icons/ri";

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
  const [hasVisitedRef, setHasVisitedRef] = useState(false);

  useEffect(() => {
    console.log(activeTab);
    if (activeTab === 0) {
      setHasVisitedRef(true);
    }
  }, [activeTab]);

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
          {activeTab !== 0 && !hasVisitedRef && (
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

import { Flex, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import { RiBarChartFill, RiCheckboxFill, RiCopperCoinFill, RiHeartsFill } from "react-icons/ri";


export const Navigation = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: (index: number) => void;
}) => {
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
        >
          <Flex flexDir="column" align="center" gap={1} color="white">
            <RiHeartsFill size="30px" />
            <Text fontSize="xs">Ref</Text>
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
            <Text fontSize="xs">Leader<br />board</Text>
          </Flex>
        </Tab>
      </TabList>
    </Tabs>
  );
};

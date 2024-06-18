import { Flex, Text, Button } from "@chakra-ui/react";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { extractUserId, verifyTelegramWebAppData } from "../utils";

export const Ref = () => {
  const [refCount] = useState(0);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (WebApp.initData) {
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
    <Flex className="refContainer" flexDir="column" align="center" gap={2}>
      <Text fontSize="40px" fontWeight="bold" color="white">
        {refCount} Referrals
      </Text>

      <Flex
        bgColor="whiteAlpha.300"
        flexDir="column"
        w="100%"
        minH="50px"
        position="relative"
        borderRadius={8}
        p={2}
        color="white"
        gap={2}
      >
        <Text>My invite link:</Text>
        <Text fontSize="xs">https://t.me/testatrbot?ref={userId}</Text>
        <Button
          position="absolute"
          right={1}
          top={1}
          size="sm"
          onClick={() =>
            navigator.clipboard.writeText(
              `https://t.me/testatrbot?ref=${userId}`
            )
          }
        >
          Copy
        </Button>
      </Flex>
    </Flex>
  );
};

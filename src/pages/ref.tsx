import { Flex, Text, Button } from "@chakra-ui/react";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";

export const Ref = () => {
  const [refCount] = useState(0);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const verifyTelegramWebAppData = async (
      telegramInitData: string
    ): Promise<boolean> => {
      const initData = new URLSearchParams(telegramInitData);
      const hash = initData.get("hash");
      const dataToCheck: string[] = [];

      initData.sort();
      initData.forEach(
        (val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`)
      );

      const secret = CryptoJS.HmacSHA256(
        import.meta.env.VITE_BOT_TOKEN,
        "WebAppData"
      );
      const _hash = CryptoJS.HmacSHA256(
        dataToCheck.join("\n"),
        secret
      ).toString(CryptoJS.enc.Hex);

      return _hash === hash;
    };

    const extractUserId = (initData) => {
      if (!initData) return;

      const params = new URLSearchParams(initData);
      const user = params.get("user");
      if (!user) return;
      const userData = JSON.parse(user);
      return userData.id;
    };

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

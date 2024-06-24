import { Flex, Text, Button, Divider, Image, useToast } from "@chakra-ui/react";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { extractUserId, verifyTelegramWebAppData } from "../utils";
import noReferrals from "../assets/noreferrals.webp";

export const Ref = () => {
  const [refCount] = useState(0);
  const [userId, setUserId] = useState("");
  const [referralList] = useState([]);

  const [, setToken] = useState("");

  useEffect(() => {
    const initData = WebApp.initData;
    console.log(initData);
    if (initData) {
      const token = initData;
      setToken(token);
    }
  }, []);

  const toast = useToast();

  const handleCopy = () => {
    if (toast.isActive("copied")) {
      return;
    }
    toast({
      id: "copied",
      title: "Copied to clipboard",
      status: "success",
      position: "top",
      duration: 2000,
      isClosable: true,
    });
  };

  useEffect(() => {
    if (WebApp.initData) {
      const data = WebApp.initData;

      if (verifyTelegramWebAppData(data)) {
        const id = extractUserId(data);

        const params = new URLSearchParams(data);
        const hash = params.get("hash");

        fetch(
          "https://europe-west6-stage-music-backend.cloudfunctions.net/memecoin_user_add_score",
          {
            method: "POST",
            body: JSON.stringify({ userId, score: 1 }),
            headers: {
              Authorization: "Bearer " + hash,
            },
          }
        );
        setUserId(id);
      } else {
        console.error("Invalid initData signature.");
      }
    }
  }, []);

  return (
    <Flex
      className="refContainer"
      flexDir="column"
      gap={2}
      color="white"
      align="center"
    >
      <Text fontSize="40px" fontWeight="bold" color="white" align="center">
        {refCount} Referrals
      </Text>

      <Flex
        bgColor="whiteAlpha.300"
        flexDir="column"
        w={{ base: "90vw", md: "40vw" }}
        minH="50px"
        position="relative"
        borderRadius={8}
        p={2}
        gap={2}
      >
        <Text fontWeight="bold">My invite link:</Text>
        <Text fontSize="xs" color="gray.400">
          https://t.me/testatrbot?start={userId}
        </Text>
        <Button
          position="absolute"
          right={1}
          top={1}
          size="sm"
          color="white"
          bgGradient="linear(to-bl, white 0%, purple.600 40%)"
          _hover={{
            color: "black",
            bgGradient: "linear(to-bl, purple.600 0%, white 40%)",
          }}
          onClick={() => handleCopy()}
        >
          Copy
        </Button>
      </Flex>
      <Divider w="98%" alignSelf="center" borderColor="gray.600" mt={2} />
      <Flex
        className="referralListContainer"
        flexDir="column"
        gap={2}
        p={0}
        w="100%"
      >
        <Text fontWeight="bold">My Referrals:</Text>
        {referralList.length > 0 ? (
          referralList.map((referral) => (
            <Flex key={referral.id}>
              <Text>{referral.id}</Text>
            </Flex>
          ))
        ) : (
          <Flex p={4} alignSelf="center">
            <Image h="200px" w="200px" src={noReferrals} alt="No referrals" />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

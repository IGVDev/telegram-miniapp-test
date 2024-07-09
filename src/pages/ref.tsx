import {
  Flex,
  Text,
  Button,
  Divider,
  Image,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { extractUserId, verifyTelegramWebAppData } from "../utils";
import noReferrals from "../assets/noreferrals.webp";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

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
}

export const Ref = () => {
  const [refCount] = useState(0);
  const [userId, setUserId] = useState("");

  const [, setToken] = useState("");

  useEffect(() => {
    const initData = WebApp.initData;
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
    navigator.clipboard.writeText(
      `https://t.me/PatataCoin_Bot/tap2earn?startapp=${userId}`
    );
    toast({
      id: "copied",
      title: "Copied to clipboard",
      status: "success",
      position: "top",
      duration: 2000,
      isClosable: true,
    });
  };

  const { data, isLoading } = useQuery<QueryData>({
    queryKey: ["login"],
  });

  useEffect(() => {
    if (WebApp.initData) {
      const data = WebApp.initData;

      if (verifyTelegramWebAppData(data)) {
        const id = extractUserId(data);

        const params = new URLSearchParams(data);
        const hash = params.get("hash");
        const paramsJson = Object.fromEntries(params.entries());
        axios
          .post(
            "https://europe-west6-stage-music-backend.cloudfunctions.net/memecoin_user_add_score",
            {
              initData: paramsJson,
              foo: "bar",
            },
            {
              headers: {
                Authorization: "Bearer " + hash,
              },
            }
          )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
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
      {isLoading && (
        <Flex justify="center" align="center" height="100vh" w="100vw">
          <Spinner size="xl" color="white" />
        </Flex>
      )}
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
          https://t.me/PatataCoin_Bot/tap2earn?startapp={userId}
        </Text>
        <Button
          position="absolute"
          right={2}
          top={2}
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
        {!isLoading && data.referrals ? (
          <Flex flexDir="column" gap={2}>
            <Text>
              You have {Object.keys(data.referrals).length} referrals!
            </Text>
            <Text>
              Your referrals have earned you
              <Text fontWeight="bold">
                {Object.keys(data.referrals).length * 3000}
              </Text>
              tokens!
            </Text>
          </Flex>
        ) : (
          <Flex p={4} alignSelf="center">
            <Image h="200px" w="200px" src={noReferrals} alt="No referrals" />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

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
import { extractUserId } from "../utils";
import noReferrals from "../assets/noreferrals.webp";
import { useQuery } from "@tanstack/react-query";
import ReactGA from "react-ga4";

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

    ReactGA.event({
      category: "User",
      action: "Copied Referral Link",
      label: userId,
    });
  };

  const { data, isLoading } = useQuery<QueryData>({
    queryKey: ["login"],
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (WebApp.initData) {
      const data = WebApp.initData;
      const id = extractUserId(data);
      setUserId(id);
      ReactGA.send({ hitType: "pageview", page: "/referrals" });
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
      {isLoading && (
        <Flex justify="center" align="center" height="100vh" w="100vw">
          <Spinner size="xl" color="white" />
        </Flex>
      )}
      {!isLoading && data && (
        <Text fontSize="40px" fontWeight="bold" color="white" align="center">
          {Object.keys(data.referrals).length} Referrals
        </Text>
      )}
      {!isLoading && data && (
        <Flex
          bgGradient="linear(to-bl, white 0%, rgb(255, 200, 0) 40%)"
          color="black"
          flexDir="column"
          w={{ base: "90vw", md: "40vw" }}
          minH="50px"
          position="relative"
          borderRadius={8}
          p={2}
          gap={2}
          textAlign="center"
        >
          <Text fontWeight="bold" textAlign="center">
            GREAT NEWS!!
          </Text>
          <Text fontSize="sm">Get $0.25 USDT for each referral!! 💰</Text>
          <Text fontSize="xs">
            You can claim your earnings once you get 20 referrals!
          </Text>
        </Flex>
      )}
      {true && (
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
          <Text fontSize="xs" color="gray.400" fontWeight="bold">
            Psst! You get 10.000 tokens per referral!
          </Text>
        </Flex>
      )}
      <Divider w="98%" alignSelf="center" borderColor="gray.600" mt={2} />
      {!isLoading && data && (
        <Flex
          className="referralListContainer"
          flexDir="column"
          gap={2}
          p={0}
          w="100%"
        >
          <Text fontWeight="bold">My Referrals:</Text>
          {!isLoading && Object.keys(data.referrals).length > 0 ? (
            <Flex flexDir="column" gap={2}>
              <Text>
                You have {Object.keys(data.referrals).length} referrals!
              </Text>
              <Text>
                Your referrals have earned you
                <Text fontWeight="bold">
                  {Object.keys(data.referrals).length * 10000} tokens!
                </Text>
              </Text>
            </Flex>
          ) : (
            <Flex p={4} alignSelf="center">
              <Image h="200px" w="200px" src={noReferrals} alt="No referrals" />
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );
};

import { Flex, Text } from "@chakra-ui/react";
import WebApp from "@twa-dev/sdk";
import axios from "axios";

import { useEffect, useState } from "react";

export const Tasks = () => {
  const [, ] = useState<string[]>([]);

  const data = WebApp.initData;
  const params = new URLSearchParams(data);
  const hash = params.get("hash");
  const paramsJson = Object.fromEntries(params.entries());

  useEffect(() => {
    axios
      .post(
        `https://europe-west6-stage-music-backend.cloudfunctions.net/memecoin_user_tasks`,
        {
          initData: paramsJson,
        },
        {
          headers: {
            Authorization: `Bearer ${hash}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      });
  }, []);

  return (
    <Flex align="center" justify="center">
      <Text
        justifyContent="start"
        w="100vw"
        fontWeight="bold"
        color="white"
        p={2}
      >
        Tasks
      </Text>
    </Flex>
  );
};

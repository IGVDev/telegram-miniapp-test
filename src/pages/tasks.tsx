import { Box, Flex, Image, Text } from "@chakra-ui/react";
import WebApp from "@twa-dev/sdk";
import axios from "axios";

import { useEffect, useState } from "react";

export const Tasks = () => {
  const [tasks, setTasks] = useState<string[]>([]);

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
        setTasks(res.data.available_tasks); // Set tasks in state
      });
  }, []);

  return (
    <Flex align="center" justify="center" direction="column">
      <Text
        justifyContent="start"
        w="100vw"
        fontWeight="bold"
        color="white"
        p={2}
      >
        Tasks
      </Text>
      {Object.keys(tasks).map((key) => (
        <Box
          key={key}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          w="80vw"
          mb={4}
        >
          <Image
            src={tasks[key].image.default}
            alt={tasks[key].title.en}
            boxSize="50px"
          />
          <Text fontWeight="bold">{tasks[key].title.en}</Text>
          <Text>{tasks[key].instructions[0].en}</Text>
          <Text>Reward: {tasks[key].reward}</Text>
        </Box>
      ))}
    </Flex>
  );
};

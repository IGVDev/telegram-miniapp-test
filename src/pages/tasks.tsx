import { Button, Flex, Image, Stack, Text } from "@chakra-ui/react";
import WebApp from "@twa-dev/sdk";
import axios from "axios";

import { useEffect, useState } from "react";

export const Tasks = () => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<{
    [key: string]: boolean;
  }>({});
  const [taskInProgress, setTaskInProgress] = useState<string | null>(null);


  const handleButtonClick = (key: string, destination: string) => {
    window.open(destination, "_blank");
    setCompletedTasks((prev) => ({ ...prev, [key]: true }));
  };

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
        setTasks(res.data.available_tasks);
      });
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      if (taskInProgress) {
        setCompletedTasks((prev) => ({ ...prev, [taskInProgress]: true }));
        setTaskInProgress(null);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [taskInProgress]);

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
        <Flex
          key={key}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          w="80vw"
          mb={4}
          color="white"
          position="relative"
        >
          <Image
            src={tasks[key].image.default}
            alt={tasks[key].title.en}
            boxSize="50px"
          />
          <Stack>
            <Text fontWeight="bold">{tasks[key].title.en}</Text>
            <Text>{tasks[key].instructions[0].en}</Text>
            <Text>Reward: {tasks[key].reward}</Text>
          </Stack>
          <Button
            position="absolute"
            right="2"
            top="2"
            onClick={() =>
              handleButtonClick(key, tasks[key].actions[0].destination)
            }
          >
            {completedTasks[key] ? "Claim" : "Start"}
          </Button>
        </Flex>
      ))}
    </Flex>
  );
};

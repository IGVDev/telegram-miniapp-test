import { Button, Flex, Image, Spinner, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import WebApp from "@twa-dev/sdk";
import axios from "axios";

import { useEffect, useState } from "react";

interface LoginData {
  first_name: string;
  last_name: string;
  language_code: string;
  referrals: Record<string, unknown>;
  referred_by: string;
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

interface TaskData {
  available_tasks: {
    [key: string]: {
      actions: Array<{
        destination: string;
        type: string;
      }>;
      image: {
        default: string;
      };
      instructions: Array<{
        en: string;
        fr: string;
      }>;
      reward: number;
      title: {
        en: string;
        fr: string;
      };
      type: string;
    };
  };
  recorded_tasks_completed: Record<string, never>;
}

export const Tasks = () => {
  const [tasks, setTasks] = useState(null);
  const [completedTasks, setCompletedTasks] = useState<{
    [key: string]: boolean;
  }>({});
  const [taskInProgress, setTaskInProgress] = useState<string | null>(null);

  const data = WebApp.initData;
  const params = new URLSearchParams(data);
  const hash = params.get("hash");
  const paramsJson = Object.fromEntries(params.entries());

  const { data: loginData } = useQuery<LoginData>({ queryKey: ["login"] });

  const handleButtonClick = (key: string, destination: string) => {
    if (completedTasks[key]) {
      const payload = {
        tasks_completed: {
          [key]: {
            time: new Date().toLocaleTimeString(),
            timestamp: Math.floor(Date.now() / 1000),
          },
        },
        initData: paramsJson,
      };

      axios
        .post(
          "https://europe-west6-stage-music-backend.cloudfunctions.net/memecoin_user_tasks",
          payload,
          {
            headers: {
              Authorization: `Bearer ${hash}`,
            },
          }
        )
        .then(() => {
          setTasks((prevTasks) => {
            const newTasks = { ...prevTasks };
            delete newTasks[key];
            return newTasks;
          });

          setCompletedTasks((prevCompletedTasks) => ({
            ...prevCompletedTasks,
            [key]: true,
          }));
        });
    } else {
      setTaskInProgress(key);

      window.open(destination, "_blank");
    }
  };

  const { data: tasksData, isLoading } = useQuery<TaskData>({
    queryKey: ["tasks"],
  });

  useEffect(() => {
    if (loginData && tasksData) {
      const completed = Object.keys(loginData.tasks_completed || {}).reduce(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {} as { [key: string]: boolean }
      );
      const newTasks = { ...tasksData.available_tasks };

      Object.keys(completed).forEach((key) => {
        delete newTasks[key];
      });

      setTasks(newTasks);
    }
  }, [loginData, tasksData]);

  useEffect(() => {
    const handleFocus = () => {
      if (taskInProgress) {
        setCompletedTasks((prev) => ({ ...prev, [taskInProgress]: true }));
        setTaskInProgress(null);
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleFocus);
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
      {(isLoading && tasks === null) && (
        <Flex justify="center" align="center" height="100vh" w="100vw">
          <Spinner size="xl" color="white" />
        </Flex>
      )}
      {!isLoading && tasks && Object.keys(tasks).length === 0 && (
        <Flex p={4} alignSelf="center" color="white">
          <Text>No tasks available</Text>
        </Flex>
      )}
      {!isLoading &&
        tasks &&
        Object.keys(tasks).map((key) => {
          const task = tasks[key];
          if (!task) return null;
          return (
            <Flex
              key={key}
              p={2}
              // borderWidth="1px"
              borderRadius="lg"
              w="90vw"
              mb={4}
              color="white"
              position="relative"
              gap={2}
              bgColor="whiteAlpha.300"
            >
              <Image
                src={tasks[key].image.default}
                alt={tasks[key].title.en}
                boxSize="50px"
                objectFit="contain"
                alignSelf="center"
              />
              <Stack fontSize="sm">
                <Text fontWeight="bold">{tasks[key].title.en}</Text>
                <Text>{tasks[key].instructions[0].en}</Text>
                <Text>Reward: {tasks[key].reward}</Text>
              </Stack>
              <Button
                position="absolute"
                right="2"
                top="2"
                color="white"
                bgGradient="linear(to-bl, white 0%, purple.600 40%)"
                _hover={{
                  color: "black",
                  bgGradient: "linear(to-bl, purple.600 0%, white 40%)",
                }}
                onClick={() =>
                  handleButtonClick(key, tasks[key].actions[0].destination)
                }
              >
                {completedTasks[key] ? "Claim" : "Start"}
              </Button>
            </Flex>
          );
        })}
    </Flex>
  );
};

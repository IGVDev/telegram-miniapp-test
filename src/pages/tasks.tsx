import { Button, Flex, Image, Stack, Text } from "@chakra-ui/react";
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

export const Tasks = () => {
  const [tasks, setTasks] = useState({});
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

  useEffect(() => {
    if (loginData) {
      const completed = Object.keys(loginData.tasks_completed || {}).reduce(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {} as { [key: string]: boolean }
      );
      setCompletedTasks(completed);
    }
  }, [loginData]);

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
      {Object.keys(tasks).map((key) => {
        const task = tasks[key];
        if (!task) return null;
        return (
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
        );
      })}
    </Flex>
  );
};

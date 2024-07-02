import { Flex, Text, Table, Tr, Td, Tbody, Thead } from "@chakra-ui/react";
import { GiTrophy } from "react-icons/gi";
import { useEffect, useState } from "react";
import axios from "axios";
import WebApp from "@twa-dev/sdk";

type LeaderboardType = {
  username: string;
  tokens: number;
};

enum TrophyColor {
  "gold" = 0,
  "silver" = 1,
  "sienna" = 2,
}

export const Leaderboard = () => {
  const data = WebApp.initData;
  const params = new URLSearchParams(data);
  const hash = params.get("hash");
  const paramsJson = Object.fromEntries(params.entries());

  const [leaderboard, setLeaderboard] = useState<LeaderboardType[]>([]);

  useEffect(() => {
    axios
      .post(
        `https://europe-west6-stage-music-backend.cloudfunctions.net/memecoin_user_ranking`,
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
        setLeaderboard(res.data.top_users);
      });
  }, []);

  return (
    <Flex
      className="leaderboardContainer"
      flexDir="column"
      gap={2}
      color="white"
      align="center"
      w="100%"
      overflowX="hidden"
    >
      <Text fontSize="40px" fontWeight="bold">
        Leaderboard
      </Text>

      <Flex className="tableContainer">
        <Table size="sm" variant="unstyled" w="90vw">
          <Thead color="gray.500">
            <Tr>
              <Td>Ranking</Td>
              <Td>Username</Td>
              <Td>Score</Td>
            </Tr>
          </Thead>
          <Tbody w="">
            {leaderboard.map((user, index) => (
              <>
                <Tr
                  key={index}
                  borderBottom={"1px solid"}
                  borderColor={"gray.600"}
                >
                  <Td>
                    {index < 3 ? (
                      <GiTrophy color={TrophyColor[index]} />
                    ) : (
                      index + 1
                    )}
                  </Td>
                  <Td>@{user.username}</Td>
                  <Td>{user.tokens}</Td>
                </Tr>
              </>
            ))}
            <Tr bgColor="purple.900">
              <Td fontWeight="bold">840</Td>
              <Td fontWeight="bold">You</Td>
              <Td fontWeight="bold">0</Td>
            </Tr>
          </Tbody>
        </Table>
      </Flex>
    </Flex>
  );
};

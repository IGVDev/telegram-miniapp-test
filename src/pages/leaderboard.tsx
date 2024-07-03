import { Flex, Text, Table, Tr, Td, Tbody, Thead } from "@chakra-ui/react";
import { GiTrophy } from "react-icons/gi";
import axios from "axios";
import WebApp from "@twa-dev/sdk";
import { useQuery } from "@tanstack/react-query";

interface LeaderboardData {
  global_rank: number;
  league_name: string;
  league_rank: number;
  top_users: LeaderboardType[];
}

interface LeaderboardType {
  avatar_photo: string;
  tokens: number;
  uid: string;
  username: string;
}

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

  const { data: leaderboardData, isLoading } = useQuery<LeaderboardData>({
    queryKey: ["leaderboard"],
    queryFn: () => {
      return axios.post(
        `https://europe-west6-stage-music-backend.cloudfunctions.net/memecoin_user_ranking`,
        {
          initData: paramsJson,
        },
        {
          headers: {
            Authorization: `Bearer ${hash}`,
          },
        }
      );
    },
  });

  const userUid = paramsJson.uid;
  const userInLeaderboard = leaderboardData?.top_users?.some(
    (user) => user.uid === userUid
  );

  console.log('LEADER', leaderboardData)

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
      {isLoading && <Text>Loading...</Text>}

      {!isLoading && leaderboardData && (
        <>
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
              <Tbody>
                {leaderboardData &&
                  leaderboardData.top_users?.map((user, index) => (
                    <Tr
                      key={user.uid}
                    borderBottom={"1px solid"}
                    borderColor={"gray.600"}
                    bgColor={
                      user.uid === userUid ? "purple.900" : "transparent"
                    }
                  >
                    <Td>
                      {index < 3 ? (
                        <GiTrophy color={TrophyColor[index]} />
                      ) : (
                        index + 1
                      )}
                    </Td>
                    <Td>@{user.username}</Td>
                    <Td>{user.tokens.toFixed(1)}</Td>
                  </Tr>
                ))}
                {!userInLeaderboard && (
                  <Tr bgColor="purple.900">
                    <Td fontWeight="bold">{leaderboardData?.global_rank}</Td>
                    <Td fontWeight="bold">You</Td>
                    <Td fontWeight="bold">0</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Flex>
        </>
      )}
    </Flex>
  );
};

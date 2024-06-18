import {
  Flex,
  Text,
  Table,
  Tr,
  Td,
  Tbody,
  Thead,
} from "@chakra-ui/react";
import { GiTrophy } from "react-icons/gi";
import { useState } from "react";

type LeaderboardType = {
  username: string;
  score: number;
};

enum TrophyColor {
  "gold" = 0,
  "silver" = 1,
  "sienna" = 2,
}

export const Leaderboard = () => {
  const mockLeaderboard = [
    { username: "John", score: 100 },
    { username: "Jane", score: 90 },
    { username: "Bob", score: 80 },
    { username: "Alice", score: 70 },
    { username: "Charlie", score: 60 },
    { username: "Dave", score: 50 },
    { username: "Eve", score: 40 },
    { username: "Frank", score: 30 },
    { username: "Grace", score: 20 },
    { username: "Henry", score: 10 },
  ];

  const [leaderboard] = useState<LeaderboardType[]>(mockLeaderboard);

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
                <Tr key={index} borderBottom={"1px solid"} borderColor={"gray.600"}>
                  <Td>
                    {index < 3 ? (
                      <GiTrophy color={TrophyColor[index]} />
                    ) : (
                      index + 1
                    )}
                  </Td>
                  <Td>{user.username}</Td>
                  <Td>{user.score}</Td>
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

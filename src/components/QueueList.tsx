import { Queue } from "@/lib/Queue";
import { VStack, List, Text, Box, Tag } from "@chakra-ui/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import React from "react";
import { useSnapshot } from "valtio";
import { Process } from "./Process";

export const QueueList = ({
  queue,
  name,
}: {
  name: string;
  queue: ReturnType<typeof useSnapshot<Queue>>;
}) => {
  const [ref] = useAutoAnimate();

  return (
    <VStack w="15rem">
      <Tag colorScheme="purple" size="lg" fontWeight="bold">
        {name}
      </Tag>
      <Text color="gray">
        Średni czas oczekiwania:{" "}
        {Math.round(queue.getAverageWaitingTime() * 10) / 10}s
      </Text>
      {queue.currentProcess ? (
        <>
          <Text>Obecny proces</Text>
          <Process process={queue.currentProcess} />
        </>
      ) : null}
      <Box ref={ref}>
        {queue.processes.map((process) => (
          <Box mb={2} key={process.pid}>
            <Process process={process} />
          </Box>
        ))}
      </Box>
    </VStack>
  );
};

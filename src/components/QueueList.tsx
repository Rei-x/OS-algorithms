import { Queue } from "@/lib/Queue";
import { VStack, List, Text, Box, Tag } from "@chakra-ui/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AnimatePresence, motion } from "framer-motion";
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
  console.log(queue.doneProcesses.length);

  return (
    <VStack w="15rem">
      <Tag colorScheme="purple" size="lg" fontWeight="bold">
        {name}
      </Tag>
      <Text color="gray">
        Średni czas oczekiwania:{" "}
        {Math.round(queue.getAverageWaitingTime() * 10) / 10}s
      </Text>
      <Box>
        {queue.currentProcess ? (
          <>
            <Text>Obecny proces</Text>
          </>
        ) : null}
        <AnimatePresence mode="popLayout">
          {queue.processes
            .slice()
            .sort((a, b) =>
              a.pid === queue.currentProcess?.pid
                ? -1
                : b.pid === queue.currentProcess?.pid
                ? 1
                : 0
            )
            .map((process) => (
              <motion.div
                layout="position"
                layoutId={process.pid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={process.pid}
              >
                <Box mb={2}>
                  <Process process={process} />
                </Box>
              </motion.div>
            ))}
        </AnimatePresence>
      </Box>
    </VStack>
  );
};

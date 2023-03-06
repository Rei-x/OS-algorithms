import Head from "next/head";
import { Inter, Lato } from "next/font/google";
import { useQueue } from "../hooks/useQueue";
import { Container, HStack, List, Text, VStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Process } from "@/components/Process";
import { createProcess } from "@/lib/Process";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { QueueList } from "@/components/QueueList";
import { useSJF } from "@/hooks/useSJF";
import { useSJFWithW } from "@/hooks/useSJFWithW";
import { useRoundRobin } from "@/hooks/useRoundRobin";
const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin-ext"],
});

export default function Home() {
  const { queue } = useQueue();
  const { SJF } = useSJF();
  const { SJFWithW } = useSJFWithW();
  const { RoundRobin } = useRoundRobin();

  const allQueues = [queue, SJF, SJFWithW, RoundRobin];

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.xl" className={lato.className}>
        <HStack mt={6} mb={6} justify="center">
          <Button
            mr={2}
            onClick={() => {
              const length = Math.floor(Math.random() * 10) + 1;
              allQueues.forEach((queue) => {
                const process = createProcess({ length: 5 });
                queue.addProcess(process);
              });
            }}
          >
            Dodaj proces
          </Button>
          <Button
            mr={2}
            onClick={() => {
              const length = Math.floor(Math.random() * 2) + 1;
              allQueues.forEach((queue) => {
                const process = createProcess({ length });
                queue.addProcess(process);
              });
            }}
          >
            Dodaj krótki proces
          </Button>
          <Button
            mr={2}
            onClick={() => {
              const length = Math.floor(Math.random() * 2) + 6;
              allQueues.forEach((queue) => {
                const process = createProcess({ length });
                queue.addProcess(process);
              });
            }}
          >
            Dodaj długi proces
          </Button>
          {queue.isRunning ? (
            <Button
              onClick={() => {
                allQueues.forEach((queue) => {
                  queue.stopQueue();
                });
              }}
            >
              Zatrzymaj kolejke
            </Button>
          ) : (
            <Button
              onClick={() => {
                allQueues.forEach((queue) => {
                  queue.startQueue();
                });
              }}
            >
              Wystartuj kolejke
            </Button>
          )}
        </HStack>
        <HStack spacing={16} alignItems="flex-start">
          <QueueList queue={queue} name="FCFS" />
          <QueueList queue={SJF} name="SJF" />
          <QueueList queue={SJFWithW} name="SJF (z wywłaszczeniem)" />
          <QueueList queue={RoundRobin} name="RoundRobin" />
        </HStack>
      </Container>
    </>
  );
}

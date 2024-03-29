import Head from "next/head";
import { useQueue } from "../hooks/useQueue";
import { Center, Container, Divider, HStack, Text } from "@chakra-ui/layout";
import { Button, ButtonProps } from "@chakra-ui/button";
import { createProcess, generatePid } from "../lib/Process";
import { QueueList } from "../components/QueueList";
import { useSJF } from "../hooks/useSJF";
import { useSJFWithW } from "../hooks/useSJFWithW";
import { useRoundRobin } from "../hooks/useRoundRobin";
import { VStack, Heading } from "@chakra-ui/react";
import { Lato } from "next/font/google";
import { Settings } from "../components/Settings";
import {
  ChevronRightIcon,
  CloseIcon,
  DeleteIcon,
  SmallAddIcon,
} from "@chakra-ui/icons";
import { useProcessSettings } from "../hooks/useProcessSettings";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin-ext"],
});

const ButtonIcon = ({
  children,
  icon,
  ...props
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
} & ButtonProps) => (
  <Button w="200px" justifyContent="start" {...props}>
    <HStack justify="start">
      <Center w="20px">{icon}</Center>
      <Text>{children}</Text>
    </HStack>
  </Button>
);

export const Home = () => {
  const { queue } = useQueue();
  const { sjf } = useSJF();
  const { sjfWithW } = useSJFWithW();
  const { roundRobin } = useRoundRobin();
  const processSettings = useProcessSettings();

  const allQueues = [queue, sjf, sjfWithW, roundRobin];

  const addProcess = (length: "short" | "medium" | "long") => {
    const settings = {
      short: processSettings.shortProcess,
      medium: processSettings.mediumProcess,
      long: processSettings.longProcess,
    } as const;

    const processLength = settings[length];

    allQueues.forEach((queue) => {
      const pid = generatePid();
      const process = createProcess({
        pid,
        length: processLength,
      });

      queue.addProcess(process);
    });
  };

  return (
    <>
      <Head>
        <title>Dostep do procesora</title>
        <meta
          name="description"
          content="Aplikacja webowa symulująca algorytmy dostępu do procesora"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HStack align="start" className={lato.className}>
        <VStack
          align="start"
          justify="space-between"
          p="4"
          px="8"
          h="100%"
          minH="100vh"
          borderColor="gray.200"
          borderRightWidth="2px"
          borderStyle="solid"
        >
          <VStack w="20rem" align="start" justify="start">
            <Heading size="lg">Dostęp do procesora</Heading>
          </VStack>
          <VStack align="start">
            <Heading textAlign="left" pt="10" mb="2" size="md">
              Panel kontrolny
            </Heading>
            <ButtonIcon
              icon={<SmallAddIcon boxSize={4} />}
              onClick={() => {
                addProcess("short");
              }}
            >
              Dodaj krótki proces
            </ButtonIcon>
            <ButtonIcon
              icon={<SmallAddIcon boxSize={6} />}
              onClick={() => {
                addProcess("medium");
              }}
            >
              Dodaj proces
            </ButtonIcon>

            <ButtonIcon
              icon={<SmallAddIcon boxSize={8} />}
              onClick={() => {
                addProcess("long");
              }}
            >
              Dodaj długi proces
            </ButtonIcon>
            {queue.isRunning ? (
              <ButtonIcon
                colorScheme="red"
                icon={<CloseIcon boxSize="4" />}
                onClick={() => {
                  allQueues.forEach((queue) => {
                    queue.stopQueue();
                  });
                }}
              >
                Zatrzymaj kolejke
              </ButtonIcon>
            ) : (
              <ButtonIcon
                icon={<ChevronRightIcon boxSize="4" />}
                onClick={() => {
                  allQueues.forEach((queue) => {
                    queue.startQueue();
                  });
                }}
              >
                Wystartuj kolejke
              </ButtonIcon>
            )}
            <ButtonIcon
              icon={<DeleteIcon />}
              onClick={() => {
                allQueues.forEach((queue) => {
                  queue.clearProcesses();
                });
              }}
            >
              Restart
            </ButtonIcon>
            <Divider pt="2" />
            <Settings />
          </VStack>
        </VStack>
        <VStack w="100%">
          <Container mt="16" ml="auto" maxW="container.xl">
            <HStack spacing={16} align="start">
              <QueueList queue={queue} name="FCFS" />
              <QueueList queue={sjf} name="SJF" />
              <QueueList queue={sjfWithW} name="SJF (z wywłaszczaniem)" />
              <QueueList queue={roundRobin} name="Round Robin" />
            </HStack>
          </Container>
        </VStack>
      </HStack>
    </>
  );
}

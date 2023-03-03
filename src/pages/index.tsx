import Head from "next/head";
import { Inter, Lato } from "next/font/google";
import { useQueue } from "./hooks/useQueue";
import { Container, HStack, List, Text, VStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Process } from "@/components/Process";
import { createProcess } from "@/lib/Process";
import { useAutoAnimate } from "@formkit/auto-animate/react";
const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin-ext"],
});

export default function Home() {
  const { queue } = useQueue();

  const [parent] = useAutoAnimate();

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.lg" className={lato.className}>
        <HStack mt={6} mb={6}>
          <Button
            mr={2}
            onClick={() => {
              const length = Math.floor(Math.random() * 10) + 1;
              queue.addProcess(createProcess({ length }));
            }}
          >
            Dodaj proces
          </Button>
          {queue.isRunning ? (
            <Button
              onClick={() => {
                queue.stopQueue();
              }}
            >
              Zatrzymaj kolejke
            </Button>
          ) : (
            <Button
              onClick={() => {
                queue.startQueue();
              }}
            >
              Wystartuj kolejke
            </Button>
          )}
        </HStack>

        {queue.currentProcess ? (
          <>
            <Text>Obecny proces</Text>
            <Process process={queue.currentProcess} />
          </>
        ) : null}
        <List spacing={2} ref={parent}>
          {queue.processes.map((process) => (
            <Process key={process.pid} process={process} />
          ))}
        </List>
      </Container>
    </>
  );
}
import { Layout } from "@/components/Layout";
import { Button, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import { numberOfSegments } from "../components/Settings";
import { useFCFS } from "../hooks/useFCFS";
import { DiskVisualizer } from "../components/DiskVisualizer";
import { useSSTF } from "../hooks/useSSTF";
import { useSCAN } from "../hooks/useSCAN";
import { useCSCAN } from "../hooks/useCSCAN";
import { ButtonIcon } from "@/components/ButtonIcon";
import {
  SmallAddIcon,
  CloseIcon,
  ChevronRightIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { useSettings } from "../hooks/useSettings";

export const Home = () => {
  const { fcfs, disk } = useFCFS({});
  const { sstf, disk: disk2 } = useSSTF({});
  const { scan, disk: disk3 } = useSCAN({});
  const { cscan, disk: disk4 } = useCSCAN({});

  const settings = useSettings();

  const allQueues = [fcfs, sstf, scan, cscan];

  return (
    <>
      <Head>
        <title>Dostep do dysku</title>
        <meta
          name="description"
          content="Aplikacja webowa symulująca algorytmy dostępu do dysku"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout
        settings={
          <VStack align="end" justify="end" mt="auto">
            <Heading textAlign="left" pt="10" mb="2" size="md">
              Panel kontrolny
            </Heading>
            <ButtonIcon icon={<SmallAddIcon boxSize={4} />}>
              Dużo żądań
            </ButtonIcon>
            <ButtonIcon icon={<SmallAddIcon boxSize={6} />}>
              Jedno żądanie na raz
            </ButtonIcon>
            <ButtonIcon
              onClick={() => {
                allQueues.forEach((queue) => {
                  queue.addToQueue(0);
                  queue.addToQueue(1);
                  queue.addToQueue(2);
                  queue.addToQueue(3);

                  queue.setOnNext(() => {
                    let current = 0;

                    if (queue.getQueueLength() < 4) {
                      queue.addToQueue(current);
                      current = (current + 1) % 4;
                    }
                  });

                  queue.addToQueue(90);
                });
              }}
              icon={<SmallAddIcon boxSize={8} />}
            >
              Głodzenie procesów
            </ButtonIcon>
            {settings.isRunning ? (
              <ButtonIcon
                onClick={() => {
                  settings.stop();
                }}
                colorScheme="red"
                icon={<CloseIcon boxSize="4" />}
              >
                Zatrzymaj dysk
              </ButtonIcon>
            ) : (
              <ButtonIcon
                onClick={() => {
                  settings.start();
                  fcfs.next();
                  sstf.next();
                  sstf.next();
                  scan.next();
                  cscan.next();
                }}
                icon={<ChevronRightIcon boxSize="4" />}
              >
                Wystartuj dysk
              </ButtonIcon>
            )}

            {!settings.isAddingPriority ? (
              <ButtonIcon
                onClick={() => {
                  settings.setAddingPriority(true);
                }}
                icon={<DeleteIcon />}
              >
                Dodawanie EDF
              </ButtonIcon>
            ) : (
              <ButtonIcon
                onClick={() => {
                  settings.setAddingPriority(false);
                }}
                icon={<DeleteIcon />}
              >
                Wyłącz EDF
              </ButtonIcon>
            )}
          </VStack>
        }
      >
        <VStack>
          <HStack>
            <Button
              onClick={() => {
                const uniqueSegments = new Set();
                for (let i = 0; i < 10; i++) {
                  const segment = Math.floor(Math.random() * numberOfSegments);
                  if (!uniqueSegments.has(segment)) {
                    uniqueSegments.add(segment);
                    fcfs.addToQueue(segment);
                    sstf.addToQueue(segment);
                    scan.addToQueue(segment);
                    cscan.addToQueue(segment);
                  }
                }
              }}
            >
              Generate Queue
            </Button>
            <Button
              colorScheme="green"
              onClick={() => {
                fcfs.next();
                sstf.next();
                sstf.next();
                scan.next();
                cscan.next();
              }}
            >
              Start
            </Button>
          </HStack>
          <Heading size="md">FCFS</Heading>
          <Text>
            Movement: {disk.moveAmount}, items in Queue {fcfs.queue.length}
          </Text>
          <DiskVisualizer disk={disk} queue={fcfs} />
          <Heading size="md">SSTF</Heading>
          <Text>
            Movement: {disk2.moveAmount}, items in Queue {sstf.queue.length}
          </Text>
          <DiskVisualizer disk={disk2} queue={sstf} />
          <Heading size="md">SCAN</Heading>
          <Text>
            Movement: {disk3.moveAmount}, items in Queue {scan.queue.length}
          </Text>
          <DiskVisualizer disk={disk3} queue={scan} />
          <Heading size="md">CSCAN</Heading>
          <Text>
            Movement: {disk4.moveAmount}, items in Queue {cscan.queue.length}
          </Text>
          <DiskVisualizer disk={disk4} queue={cscan} />
        </VStack>
      </Layout>
    </>
  );
};

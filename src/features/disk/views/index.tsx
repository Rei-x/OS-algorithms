import { Layout } from "@/components/Layout";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import { Settings, numberOfSegments } from "../components/Settings";
import { useFCFS } from "../hooks/useFCFS";
import { DiskVisualizer } from "../components/DiskVisualizer";
import { useSSTF } from "../hooks/useSSTF";

export const Home = () => {
  const { fcfs, disk } = useFCFS({});
  const { sstf, disk: disk2 } = useSSTF({});

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
      <Layout settings={<Settings />}>
        <VStack>
          <Text>
            Movement: {disk.moveAmount}, items in Queue {fcfs.queue.length}
          </Text>
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
              }}
            >
              Start
            </Button>
          </HStack>
          <DiskVisualizer disk={disk} queue={fcfs} />
          <DiskVisualizer disk={disk2} queue={sstf} />
        </VStack>
      </Layout>
    </>
  );
};

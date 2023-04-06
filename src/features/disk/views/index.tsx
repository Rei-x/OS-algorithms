import { Layout } from "@/components/Layout";
import { HStack, VStack } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import { Settings } from "../components/Settings";

export const Home = () => {
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
      <Layout settings={<Settings />}><VStack>
          <HStack>
            
          </HStack>
        </VStack></Layout>
    </>
  );
};

import { Settings } from "@/features/cpu/components/Settings";
import {
  SmallAddIcon,
  CloseIcon,
  ChevronRightIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import {
  HStack,
  VStack,
  Heading,
  Divider,
  Button,
  ButtonProps,
  Center,
  Text,
} from "@chakra-ui/react";
import { Lato } from "next/font/google";
import Head from "next/head";
import React, { ReactNode } from "react";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin-ext"],
});

export const Layout = ({
  children,
  settings,
}: {
  children: ReactNode;
  settings: ReactNode;
}) => {
  return (
    <>
      <HStack align="start" className={lato.className}>
        <VStack
          align="start"
          justify="space-between"
          p="4"
          px="8"
          h="100%"
          minH="90vh"
          borderColor="gray.200"
          borderRightWidth="2px"
          borderStyle="solid"
        >
          {settings}
        </VStack>
        <VStack w="100%">{children}</VStack>
      </HStack>
    </>
  );
};

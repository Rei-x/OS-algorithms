import { Box, Flex, Text, VStack } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import chroma from "chroma-js";
import { Process as ProcessType } from "@/lib/Process";
import { Tag } from "@chakra-ui/react";

const getColor = chroma.scale(["red", "yellow", "green"]).domain([0, 100]);

export const Process = ({ process }: { process: ProcessType }) => {
  const height = 100 - (process.remaining / process.length) * 100;
  const color = getColor(height).hex();

  return (
    <VStack
      w="7rem"
      h="7rem"
      bg="blackAlpha.50"
      position="relative"
      borderRadius="md"
      overflow="hidden"
    >
      <Flex
        flexDir="column"
        justify="space-between"
        align="center"
        textAlign="center"
        p="2"
        h="100%"
      >
        <Box>
          <Text fontWeight="semibold">Proces</Text>
          <Tag mt="2" colorScheme="blackAlpha">
            {process.pid}
          </Tag>
        </Box>
        <Box>
          <Text pl={2} fontSize="sm">
            {Math.round(process.length / 1000)}s
          </Text>
        </Box>
      </Flex>
      <Box
        w="100%"
        h="7rem"
        bg={color}
        position="absolute"
        bottom="0"
        left="0"
        transform="auto"
        transformOrigin="bottom"
        transition="all 0.30s linear"
        scaleY={height / 100}
        zIndex="-1"
      />
    </VStack>
  );
};

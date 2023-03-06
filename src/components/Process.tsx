import { Box, Text, VStack } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import chroma from "chroma-js";
import { Process as ProcessType } from "@/lib/Process";

const getColor = chroma.scale(["red", "yellow", "green"]).domain([0, 100]);

export const Process = ({ process }: { process: ProcessType }) => {
  const height = 100 - (process.length / process.initialLength) * 100;
  const [color, setColor] = useState(() => getColor(height).hex());

  useEffect(() => {
    setColor(getColor(height).hex());
  }, [height]);

  return (
    <VStack
      w="6rem"
      h="6rem"
      bg="blackAlpha.50"
      position="relative"
      borderRadius="md"
      overflow="hidden"
    >
      <Box>
        <Text fontWeight="semibold">Proces</Text>
        <Text pl={2} fontSize="sm">
          Długość procesu: {Math.round(process.length)}
        </Text>
        <Text>{process.pid}</Text>
      </Box>
      <Box
        w="100%"
        h="6rem"
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

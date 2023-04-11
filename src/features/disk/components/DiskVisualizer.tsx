import { Box, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import { FaLongArrowAltDown } from "react-icons/fa";
import { Disk } from "../hooks/useDisk";
import { numberOfSegments, width } from "./Settings";

export const DiskVisualizer = ({
  queue,
  disk,
}: {
  queue: {
    next: () => void;
    queue: readonly number[];
  };
  disk: Disk;
}) => {
  return (
    <Box position="relative">
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          width: "10px",
          height: "50px",
        }}
        animate={{
          x:
            (disk.currentPosition / numberOfSegments) * parseInt(width) +
            disk.currentPosition,
        }}
        onAnimationComplete={() => {
          queue.next();
        }}
        transition={{
          type: "tween",
          ease: "linear",
          duration: Math.abs(disk.currentDifference * 0.01),
        }}
      >
        <Icon
          position="absolute"
          as={FaLongArrowAltDown}
          left={"5px"}
          transform="translateX(-50%)"
          top={0}
          h="40px"
        />
      </motion.div>
      <Box pt="40px" gap={"1px"} display="flex">
        {disk.segments.map((segment, i) => (
          <Box
            key={i}
            w="10px"
            fontSize="7px"
            h="10px"
            bgColor={
              segment.isDone ? "green" : segment.isQueued ? "red" : "gray.200"
            }
            transition="all 0.1s ease-in-out"
          >
            {queue.queue.indexOf(i) !== -1 ? queue.queue.indexOf(i) : ""}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

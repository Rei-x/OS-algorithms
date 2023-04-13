import { Box, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import { FaLongArrowAltDown } from "react-icons/fa";
import { Disk } from "../hooks/useDisk";
import { numberOfSegments, width } from "./Settings";
import { useSettings } from "../hooks/useSettings";
import { Segment } from "../lib/segment";

export const DiskVisualizer = ({
  queue,
  disk,
}: {
  queue: {
    next: () => void;
    queue: readonly number[];
    addToQueue: (number: number) => void;
    addToPriorityQueue: (number: number) => void;
    removeFromQueue: (number: number) => void;
    removeFromPriorityQueue: (number: number) => void;
  };
  disk: Disk;
}) => {
  const settings = useSettings();

  const onClickHandler = (segment: Segment) => {
    if (segment.isQueued) {
      if (settings.isAddingPriority) {
        queue.removeFromPriorityQueue(segment.numberOnDisk);
      } else {
        queue.removeFromQueue(segment.numberOnDisk);
      }
    } else {
      if (settings.isAddingPriority) {
        queue.addToPriorityQueue(segment.numberOnDisk);
      } else {
        queue.addToQueue(segment.numberOnDisk);
      }
    }
  };

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
            key={segment.numberOnDisk}
            w="10px"
            fontSize="7px"
            h="10px"
            bgColor={
              segment.isDone ? "green" : segment.isQueued ? "red" : "gray.200"
            }
            _hover={{
              bgColor: segment.isQueued ? "red.200" : "gray.300",
            }}
            cursor="pointer"
            transition="all 0.3s ease-in-out"
            onClick={() => onClickHandler(segment)}
          />
        ))}
      </Box>
    </Box>
  );
};

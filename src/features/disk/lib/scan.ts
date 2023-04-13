import { Disk } from "../hooks/useDisk";
import { createFCFS } from "./fcfs";

export const createSCAN = ({ disk }: { disk: Disk }) => {
  const state = createFCFS({ disk });

  let direction = "up";

  state.next = () => {
    if (state.priorityQueue.length > 0) {
      const current = state.priorityQueue.shift() ?? null;
      disk.getCurrentSegment()?.setIsDone(true);
      disk.getCurrentSegment()?.setIsQueued(false);
      if (current !== null) {
        disk.jumpToPosition(current);
      }
      return;
    }

    state.queue.sort();

    if (disk.getCurrentSegment()?.isQueued) {
      disk.getCurrentSegment()?.setIsQueued(false);
      disk.getCurrentSegment()?.setIsDone(true);
    }

    const maxLength = disk.segments.length;

    if (disk.getCurrentPosition() === maxLength - 1) {
      direction = "down";
    }

    if (disk.getCurrentPosition() === 0) {
      direction = "up";
    }

    const next =
      direction === "up"
        ? disk.getCurrentPosition() + 1
        : disk.getCurrentPosition() - 1;

    const isEmpty = state.queue.length === 0;
    state.queue = state.queue.filter((value) => value !== next);

    if (!isEmpty) {
      disk.jumpToPosition(next);
    }
  };

  return state;
};

export type FCFS = ReturnType<typeof createSCAN>;

import { Disk } from "../hooks/useDisk";
import { createFCFS } from "./fcfs";

export const createCSCAN = ({ disk }: { disk: Disk }) => {
  const state = createFCFS({ disk });

  state.next = () => {
    state.onNext();

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

    const next =
      disk.getCurrentPosition() + 1 === maxLength
        ? 0
        : disk.getCurrentPosition() + 1;

    const isEmpty = state.queue.length === 0;
    state.queue = state.queue.filter((value) => value !== next);

    if (!isEmpty) {
      disk.jumpToPosition(next);
    }
  };

  return state;
};

export type FCFS = ReturnType<typeof createCSCAN>;

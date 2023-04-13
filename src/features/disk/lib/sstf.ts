import { Disk } from "../hooks/useDisk";
import { createFCFS } from "./fcfs";

export const createSSTF = ({ disk }: { disk: Disk }) => {
  const state = createFCFS({ disk });

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

    disk.getCurrentSegment()?.setIsDone(true);
    disk.getCurrentSegment()?.setIsQueued(false);

    const lastCurrent = disk.getCurrentPosition() ?? 0;

    const sortedQueue = [...state.queue].sort(
      (a, b) => Math.abs(a - lastCurrent) - Math.abs(b - lastCurrent)
    );

    const current = sortedQueue.at(0) ?? null;

    state.queue = state.queue.filter((value) => value !== current);

    if (current !== null) {
      disk.jumpToPosition(current);
    }
    state.onNext();
  };

  return state;
};

export type FCFS = ReturnType<typeof createSSTF>;

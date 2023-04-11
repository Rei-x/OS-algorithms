import { proxy } from "valtio";
import { Disk } from "../hooks/useDisk";
import { createFCFS } from "./fcfs";

export const createSSTF = ({ disk }: { disk: Disk }) => {
  const state = createFCFS({ disk });

  state.next = () => {
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
  };

  return state;
};

export type FCFS = ReturnType<typeof createSSTF>;

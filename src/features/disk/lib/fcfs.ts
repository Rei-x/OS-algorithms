import { proxy } from "valtio";
import { Disk } from "../hooks/useDisk";

export const createFCFS = ({ disk }: { disk: Disk }) => {
  const state = proxy({
    queue: [] as number[],
    priorityQueue: [] as number[],
    onNext: () => {},
    setOnNext: (onNext: () => void) => {
      state.onNext = onNext;
    },
    getQueueLength: () => state.queue.length,
    next: () => {
      if (state.priorityQueue.length > 0) {
        const current = state.priorityQueue.shift() ?? null;
        disk.getCurrentSegment()?.setIsDone(true);
        disk.getCurrentSegment()?.setIsQueued(false);
        if (current !== null) {
          disk.jumpToPosition(current);
        }
        return;
      }

      const current = state.queue.shift() ?? null;
      disk.getCurrentSegment()?.setIsDone(true);
      disk.getCurrentSegment()?.setIsQueued(false);
      if (current !== null) {
        disk.jumpToPosition(current);
      }
      state.onNext();
    },
    addToQueue: (numberOnDisk: number) => {
      disk.getSegmentAtPosition(numberOnDisk)?.setIsQueued(true);
      disk.getSegmentAtPosition(numberOnDisk)?.setIsDone(false);
      state.queue.push(numberOnDisk);
    },
    removeFromQueue: (numberOnDisk: number) => {
      disk.getSegmentAtPosition(numberOnDisk)?.setIsQueued(false);
      disk.getSegmentAtPosition(numberOnDisk)?.setIsDone(false);
      state.queue = state.queue.filter((value) => value !== numberOnDisk);
    },
    addToPriorityQueue: (numberOnDisk: number) => {
      disk.getSegmentAtPosition(numberOnDisk)?.setIsQueued(true);
      disk.getSegmentAtPosition(numberOnDisk)?.setIsDone(false);
      state.priorityQueue.push(numberOnDisk);
    },
    removeFromPriorityQueue: (numberOnDisk: number) => {
      disk.getSegmentAtPosition(numberOnDisk)?.setIsQueued(false);
      disk.getSegmentAtPosition(numberOnDisk)?.setIsDone(false);
      state.priorityQueue = state.priorityQueue.filter(
        (value) => value !== numberOnDisk
      );
    },
    disk,
  });

  return state;
};

export type FCFS = ReturnType<typeof createFCFS>;

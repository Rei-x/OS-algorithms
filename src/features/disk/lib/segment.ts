import { proxy } from "valtio";

export const createSegment = ({ numberOnDisk }: { numberOnDisk: number }) => {
  const state = proxy({
    isDone: false,
    isQueued: false,
    numberOnDisk,
    priority: 0,
    setIsDone: (isDone: boolean) => {
      state.isDone = isDone;
    },
    setIsQueued: (isQueued: boolean) => {
      state.isQueued = isQueued;
    },
  });

  return state;
};

export type Segment = ReturnType<typeof createSegment>;

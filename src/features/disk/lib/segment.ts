import { proxy } from "valtio";

export const createSegment = () => {
  const state = proxy({
    isDone: false,
    isCurrent: false,
    numberOnDisk: 0,
    priority: 0,
    setIsDone: (isDone: boolean) => {
      state.isDone = isDone;
    },
    setIsCurrent: (isCurrent: boolean) => {
      state.isCurrent = isCurrent;
    },
  });

  return state;
};

export type Segment = ReturnType<typeof createSegment>;

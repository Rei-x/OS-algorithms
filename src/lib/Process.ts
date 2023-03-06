import { proxy } from "valtio";

export const createProcess = ({ length }: { length: number }) => {
  const state = proxy({
    pid: Math.random().toString(36).slice(2),
    length,
    initialLength: length,
    registrationTime: new Date(),
    lastIncrease: 0,
    waitingTime: 0,
    isDone() {
      return state.length <= 0;
    },
    increaseWaitingTime(increase: number) {
      state.lastIncrease += increase;
    },
  });

  return state;
};

export type Process = ReturnType<typeof createProcess>;

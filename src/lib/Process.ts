import { proxy, subscribe } from "valtio";

export const createProcess = ({ length }: { length: number }) => {
  const state = proxy({
    pid: Math.random().toString(36).slice(0, 6),
    length,
    remaining: length,
    waitingTime: 0,
    isRunning: false,
    isFinished: false,
    decreaseRemaining: (amount: number) => {
      if (!state.isFinished) {
        state.remaining -= amount;
      }
      if (state.remaining <= 0) {
        state.isFinished = true;
      }
    },
    increaseWaitingTime: (amount: number) => {
      state.waitingTime += amount;
    },
  });

  return state;
};

export type Process = ReturnType<typeof createProcess>;

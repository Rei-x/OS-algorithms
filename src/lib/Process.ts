import { proxy } from "valtio";

export const processSettings = proxy({
  shortProcess: 2 * 1000,
  setShortProcess: (value: number) => {
    processSettings.shortProcess = value * 1000;
  },
  mediumProcess: 5 * 1000,
  setMediumProcess: (value: number) => {
    processSettings.mediumProcess = value * 1000;
  },
  longProcess: 10 * 1000,
  setLongProcess: (value: number) => {
    processSettings.longProcess = value * 1000;
  },
});

export const generatePid = () => Math.random().toString(36).slice(2, 8);

export const createProcess = ({
  length,
  pid,
}: {
  length: number;
  pid: string;
}) => {
  const state = proxy({
    length,
    pid,
    remaining: length,
    waitingTime: 0,
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

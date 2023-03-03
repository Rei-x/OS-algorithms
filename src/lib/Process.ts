import { proxy } from "valtio";

export const createProcess = ({ length }: { length: number }) => {
  const state = proxy({
    pid: Math.random().toString(36).slice(2),
    length,
    initialLength: length,
    registrationTime: new Date(),
    waitingTime: 0,
    isDone() {
      return state.length <= 0;
    },
  });

  return state;
};

export type Process = ReturnType<typeof createProcess>;

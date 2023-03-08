import { proxy } from "valtio";
import { Process } from "./Process";
import { waiter } from "./waiter";
export const createCPU = () => {
  const state = proxy({
    consumeProcess: async ({ process }: { process: Process }) => {
      const timePassed = process.decreaseRemaining(waiter.tickValue);
      await waiter.wait(timePassed);

      return timePassed;
    },
  });

  return state;
};

export type CPU = ReturnType<typeof createCPU>;

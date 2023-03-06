import { proxy } from "valtio";
import { Process } from "./Process";
import { waiter } from "./waiter";
export const createCPU = () => {
  const state = proxy({
    consumeProcess: async ({ process }: { process: Process }) => {
      await waiter.wait();
      process.decreaseRemaining(waiter.tickValue);
    },
  });

  return state;
};

export type CPU = ReturnType<typeof createCPU>;

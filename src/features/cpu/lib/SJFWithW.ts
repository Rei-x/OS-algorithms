import { CPU } from "./CPU";
import { Process } from "./Process";
import { createQueue } from "./Queue";

export const createSJFWithW = (cpu: CPU) => {
  const state = createQueue(cpu);

  state.addProcess = (process: Process) => {
    state.processes.push(process);
    state.processes.sort((a, b) => a.remaining - b.remaining);
    state.clearCurrentProcess();
  };

  return state;
};

export type SJF = ReturnType<typeof createSJFWithW>;

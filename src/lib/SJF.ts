import { CPU } from "./CPU";
import { Process } from "./Process";
import { createQueue } from "./Queue";

export const createSJF = (cpu: CPU) => {
  const state = createQueue(cpu);

  state.addProcess = (process: Process) => {
    state.processes.push(process);
    state.processes.sort((a, b) => a.length - b.length);
  };

  return state;
};

export type SJF = ReturnType<typeof createSJF>;

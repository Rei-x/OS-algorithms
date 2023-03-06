import { CPU } from "./CPU";
import { Process } from "./Process";
import { createQueue } from "./Queue";

export const createRoundRobin = (cpu: CPU) => {
  const state = createQueue(cpu);

  const nextArray = () => {
    if (state.processes.length > 0) {
      state.clearCurrentProcess();
      state.processes.push(state.processes.shift() as Process);
    }
  };

  state.startQueue = async () => {
    state.isRunning = true;
    while (!state.allProcessesDone()) {
      if (state.currentProcess === null) {
        const process = state.getProcesses()[0];
        if (process) {
          state.setCurrentProcess(process);
        }
      }
      if (state.currentProcess) {
        await state.cpu.consumeProcess({ process: state.currentProcess });
        if (state.currentProcess && state.currentProcess.isFinished) {
          state.finishProcess(state.currentProcess);
          state.clearCurrentProcess();
        }
      }
      state.increaseWaitingTime();
      nextArray();
    }
    state.clearCurrentProcess();
    state.stopQueue();
  };

  return state;
};

export type RoundRobin = ReturnType<typeof createRoundRobin>;

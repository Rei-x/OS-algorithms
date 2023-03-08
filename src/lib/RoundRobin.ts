import { proxy } from "valtio";
import { CPU } from "./CPU";
import { Process } from "./Process";
import { createQueue } from "./Queue";

export const roundRobinSettings = proxy({
  jumpEveryXTicks: 5,
  setJumpEveryXTicks: (value: number) => {
    roundRobinSettings.jumpEveryXTicks = value;
  },
});

export const createRoundRobin = (cpu: CPU) => {
  const state = createQueue(cpu);

  const nextArray = () => {
    if (state.processes.length > 0) {
      state.clearCurrentProcess();
      state.processes.push(state.processes.shift() as Process);
    }
  };

  let currentTick = 0;

  state.startQueue = async () => {
    state.isRunning = true;
    while (!state.allProcessesDone() && state.isRunning) {
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

      currentTick++;
      if (currentTick % roundRobinSettings.jumpEveryXTicks === 0) nextArray();
    }
    state.clearCurrentProcess();
    state.stopQueue();
  };

  return state;
};

export type RoundRobin = ReturnType<typeof createRoundRobin>;

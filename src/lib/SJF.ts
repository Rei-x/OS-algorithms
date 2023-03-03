import { proxy, subscribe } from "valtio";
import { CPU } from "./CPU";
import { Process } from "./Process";
import { Queue } from "./Queue";

export const createSJFNonW = ({ cpu }: { cpu: CPU }): Queue => {
  const state = proxy({
    processes: [] as Process[],
    doneProcesses: [] as Process[],
    isRunning: false,
    currentProcess: null as Process | null,
    interval: null as NodeJS.Timer | null,
    subscription: null as (() => void) | null,
    cpu,
    addProcess(process: Process) {
      state.processes.push(process);
      state.processes.sort((a, b) => a.length - b.length);
    },

    getProcesses() {
      return state.processes;
    },

    getAverageWaitingTime() {
      const sum = state.doneProcesses.reduce(
        (acc, process) => acc + process.waitingTime,
        0
      );

      return sum / state.doneProcesses.length;
    },

    consumeProcess: () => {
      if (!state.currentProcess || state.currentProcess.isDone()) {
        const process = state.processes.shift() ?? null;

        state.currentProcess = process;
      }

      cpu.setCurrentProcess(state.currentProcess);
    },

    startQueue: () => {
      state.isRunning = true;

      state.interval = setInterval(() => {
        state.processes.forEach((process) => {
          process.waitingTime += 1;
        });
      }, 1000);

      cpu.start((process) => {
        state.doneProcesses.push(process);
        state.consumeProcess();
      });

      state.subscription = subscribe(state.processes, () => {
        if (state.processes.length > 0 && state.currentProcess === null) {
          state.consumeProcess();
        }
      });

      state.consumeProcess();

      return state.doneProcesses;
    },

    stopQueue: () => {
      state.isRunning = false;

      if (state.interval) {
        clearInterval(state.interval);
      }
      state.subscription?.();
      cpu.stop();
    },
  });

  return state;
};

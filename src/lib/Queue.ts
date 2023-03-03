import { proxy, subscribe } from "valtio";
import { CPU } from "./CPU";
import { Process } from "./Process";

export const createQueue = ({ cpu }: { cpu: CPU }) => {
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
    },

    getProcesses() {
      return state.processes;
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
        console.log("proces zakończony");
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

export type Queue = ReturnType<typeof createQueue>;

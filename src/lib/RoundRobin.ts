import { proxy } from "valtio";
import { CPU } from "./CPU";
import { Process } from "./Process";

export const createRoundRobin = ({ cpu }: { cpu: CPU }) => {
  const state = proxy({
    processes: [] as Process[],
    doneProcesses: [] as Process[],
    isRunning: false,
    currentProcess: null as Process | null,
    interval: null as NodeJS.Timer | null,
    subscriptions: [] as (() => void)[],
    cpu,
    addProcess(process: Process) {
      state.processes.push(process);
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
      const runNextProcess = () => {
        const process = state.processes.at(0) ?? null;

        if (
          state.currentProcess &&
          !state.currentProcess?.isDone() &&
          process
        ) {
          state.processes.shift();
          state.processes.push(state.currentProcess);
          state.currentProcess = process;
          cpu.setCurrentProcess(state.currentProcess);
        }

        if (!state.currentProcess) {
          state.processes.shift();
          state.currentProcess = process;
          cpu.setCurrentProcess(state.currentProcess);
        }

        return setTimeout(() => {
          runNextProcess();
        }, 6000);
      };

      const timeout = runNextProcess();

      state.subscriptions.push(() => clearTimeout(timeout));
    },

    startQueue: () => {
      state.isRunning = true;

      state.interval = setInterval(() => {
        console.log("ilość procesów", state.processes.length);
        state.processes.forEach((process) => {
          process.increaseWaitingTime(0.5);
        });
      }, 500);

      cpu.start((process) => {
        const runNextProcess = () => {
          const process = state.processes.shift() ?? null;

          if (state.currentProcess && !state.currentProcess?.isDone()) {
            state.processes.push(state.currentProcess);
          }

          state.currentProcess = process;
          cpu.setCurrentProcess(state.currentProcess);
        };

        state.doneProcesses.push(process);
        runNextProcess();
      });

      state.consumeProcess();

      return state.doneProcesses;
    },

    stopQueue: () => {
      state.isRunning = false;

      if (state.interval) {
        clearInterval(state.interval);
      }

      state.subscriptions.forEach((unsubscribe) => unsubscribe());
      cpu.stop();

      console.log("rr", state.doneProcesses);
    },
  });

  return state;
};

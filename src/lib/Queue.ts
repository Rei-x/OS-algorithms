import { proxy } from "valtio";
import { CPU } from "./CPU";
import { Process } from "./Process";
import { waiter } from "./waiter";

export const createQueue = (cpu: CPU) => {
  const state = proxy({
    cpu,
    processes: [] as Process[],
    doneProcesses: [] as Process[],
    isRunning: false,
    currentProcess: null as Process | null,
    setCurrentProcess: (process: Process) => {
      state.currentProcess = process;
    },
    clearCurrentProcess: () => {
      state.currentProcess = null;
    },
    addProcess: (process: Process) => {
      state.processes.push(process);
    },
    getProcesses: () => {
      return state.processes.filter(
        (p) => !p.isFinished && state.currentProcess?.pid !== p.pid
      );
    },
    increaseWaitingTime: () => {
      state.processes.forEach((p) => {
        if (!p.isFinished && p.pid !== state.currentProcess?.pid) {
          p.increaseWaitingTime(waiter.tickValue);
        }
      });
    },
    allProcessesDone: () => {
      return state.processes.every((p) => p.isFinished);
    },
    finishProcess: (process: Process) => {
      state.processes = state.processes.filter((p) => p.pid !== process.pid);

      if (state.currentProcess?.pid === process.pid) {
        state.currentProcess = null;
      }

      state.doneProcesses.push(process);
    },
    clearProcesses: () => {
      state.processes = [];
      state.doneProcesses = [];
      state.clearCurrentProcess();
      state.stopQueue();
    },
    getAverageWaitingTime: () => {
      if (state.doneProcesses.length === 0) {
        return 0;
      }

      const totalWaitingTime = state.doneProcesses.reduce(
        (acc, p) => acc + p.waitingTime,
        0
      );
      return totalWaitingTime / state.doneProcesses.length / 1000;
    },
    startQueue: async () => {
      state.isRunning = true;
      while (!state.allProcessesDone() && state.isRunning) {
        if (state.currentProcess === null) {
          const process = state.getProcesses().at(0);
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
      }
      state.clearCurrentProcess();
      state.stopQueue();
    },
    stopQueue: () => {
      console.log("Queue done");
      console.log("Average waiting time: ", state.getAverageWaitingTime());
      console.log("Done processes: ", state.doneProcesses);
      state.isRunning = false;
    },
  });

  return state;
};

export type Queue = ReturnType<typeof createQueue>;

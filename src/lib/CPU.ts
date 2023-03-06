import { proxy } from "valtio";
import { subscribeKey } from "valtio/utils";
import { Process } from "./Process";

const isDifferentProcess = (
  processA: Process | null,
  processB: Process | null
) => {
  if (processA === null && processB === null) {
    return false;
  }

  if (processA === null || processB === null) {
    return true;
  }

  return processA.pid !== processB.pid;
};

export const createCPU = ({ speed }: { speed: number }) => {
  const state = proxy({
    speed,
    currentlyRunningProcess: null as Process | null,

    currentInterval: null as NodeJS.Timer | null,
    currentSubscription: null as (() => void) | null,

    isFree: () => {
      return state.currentlyRunningProcess === null;
    },
    setCurrentProcess: (process: Process | null) => {
      state.currentlyRunningProcess = process;
    },
    start: (onProcessDone?: (process: Process) => void) => {
      let lastProcess: Process | null = null;

      state.currentSubscription = subscribeKey(
        state,
        "currentlyRunningProcess",
        (process) => {
          if (isDifferentProcess(lastProcess, process)) {
            state.stopCurrentProcess();
          } else {
            return;
          }

          lastProcess = process;

          if (process === null) {
            return;
          }

          const intervalSpeed = 100;

          process.waitingTime += process.lastIncrease;
          process.lastIncrease = 0;

          state.currentInterval = setInterval(() => {
            if (process.isDone()) {
              state.currentlyRunningProcess = null;
              onProcessDone?.(process);
              state.stopCurrentProcess();
            } else {
              process.length -= state.speed * (intervalSpeed / 1000);
            }
          }, intervalSpeed);
        }
      );
    },
    stopCurrentProcess: () => {
      if (state.currentInterval) {
        clearInterval(state.currentInterval);
      }
    },
    stop: () => {
      state.stopCurrentProcess();
      state.currentlyRunningProcess = null;
      if (state.currentSubscription) {
        state.currentSubscription();
      }
    },
  });

  return state;
};

export type CPU = ReturnType<typeof createCPU>;

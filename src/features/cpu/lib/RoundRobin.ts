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

  state.afterProcessProcessed = () => {
    currentTick++;
    if (currentTick % roundRobinSettings.jumpEveryXTicks === 0) nextArray();
  };
  return state;
};

export type RoundRobin = ReturnType<typeof createRoundRobin>;

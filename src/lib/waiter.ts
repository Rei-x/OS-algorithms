import { proxy } from "valtio";

export const waiter = proxy({
  shouldWait: true,
  tickValue: 200,
  lastTickValue: 200,
  wait: async (value?: number) => {
    if (waiter.shouldWait) {
      await new Promise((resolve) =>
        setTimeout(resolve, value ?? waiter.tickValue)
      );
    }
  },
  setTickValue: (tickValue: number) => {
    waiter.tickValue = tickValue;
  },
  setShouldWait: (shouldWait: boolean) => {
    waiter.shouldWait = shouldWait;
    if (!shouldWait) {
      waiter.lastTickValue = waiter.tickValue;
      waiter.tickValue = 1000;
    } else {
      waiter.tickValue = waiter.lastTickValue;
    }
  },
});

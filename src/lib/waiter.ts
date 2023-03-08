import { proxy } from "valtio";

export const waiter = proxy({
  shouldWait: true,
  tickValue: 200,
  wait: async (value?: number) => {
    if (waiter.shouldWait) {
      await new Promise((resolve) =>
        setTimeout(resolve, value ?? waiter.tickValue)
      );
    }
  },
});

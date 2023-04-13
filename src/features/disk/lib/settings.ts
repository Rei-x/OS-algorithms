import { proxy } from "valtio";

export const settingsProxy = proxy({
  isRunning: false,
  start: () => {
    settingsProxy.isRunning = true;
  },
  stop: () => {
    settingsProxy.isRunning = false;
  },
});

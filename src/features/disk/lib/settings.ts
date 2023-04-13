import { proxy } from "valtio";

export const settingsProxy = proxy({
  isRunning: false,
  start: () => {
    settingsProxy.isRunning = true;
  },
  stop: () => {
    settingsProxy.isRunning = false;
  },
  isAddingPriority: false,
  setAddingPriority: (value: boolean) => {
    settingsProxy.isAddingPriority = value;
  },
});

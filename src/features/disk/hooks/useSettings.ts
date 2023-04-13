import { useSnapshot } from "valtio";
import { settingsProxy } from "../lib/settings";

export const useSettings = () => {
  return useSnapshot(settingsProxy);
};

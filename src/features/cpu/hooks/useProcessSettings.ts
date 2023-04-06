import { processSettings } from "../lib/Process";
import { useSnapshot } from "valtio";

export const useProcessSettings = () => {
  return useSnapshot(processSettings);
};

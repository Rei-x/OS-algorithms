import { useSnapshot } from "valtio";
import { createCPU } from "@/lib/CPU";
import { createRoundRobin, roundRobinSettings } from "@/lib/RoundRobin";

const cpuProxy = createCPU();
const queueProxy = createRoundRobin(cpuProxy);

export const useRoundRobin = () => {
  const cpu = useSnapshot(cpuProxy);
  const roundRobin = useSnapshot(queueProxy);

  return { cpu, roundRobin };
};

export const useRoundRobinSettings = () => {
  const settings = useSnapshot(roundRobinSettings);

  return settings;
};

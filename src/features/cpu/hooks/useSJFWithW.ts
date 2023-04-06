import { useSnapshot } from "valtio";
import { createCPU } from "../lib/CPU";
import { createSJFWithW } from "../lib/SJFWithW";

const cpuProxy = createCPU();
const queueProxy = createSJFWithW(cpuProxy);

export const useSJFWithW = () => {
  const cpu = useSnapshot(cpuProxy);
  const sjfWithW = useSnapshot(queueProxy);

  return { cpu, sjfWithW };
};

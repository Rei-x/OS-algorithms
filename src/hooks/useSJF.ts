import { useSnapshot } from "valtio";
import { createCPU } from "@/lib/CPU";
import { createSJF } from "@/lib/SJF";

const cpuProxy = createCPU();
const queueProxy = createSJF(cpuProxy);

export const useSJF = () => {
  const cpu = useSnapshot(cpuProxy);
  const sjf = useSnapshot(queueProxy);

  return { cpu, sjf };
};

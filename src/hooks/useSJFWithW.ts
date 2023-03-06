import { useSnapshot } from "valtio";
import { createCPU } from "@/lib/CPU";
import { createSJFWithW } from "@/lib/SJFWithW";

const cpuProxy = createCPU({ speed: 1 });
const queueProxy = createSJFWithW({ cpu: cpuProxy });

export const useSJFWithW = () => {
  const SJFWithW = useSnapshot(queueProxy);

  return { SJFWithW };
};

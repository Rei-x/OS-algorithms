import { useSnapshot } from "valtio";
import { createCPU } from "@/lib/CPU";
import { createSJFNonW } from "@/lib/SJF";

const cpuProxy = createCPU({ speed: 1 });
const queueProxy = createSJFNonW({ cpu: cpuProxy });

export const useSJF = () => {
  const SJF = useSnapshot(queueProxy);

  return { SJF };
};

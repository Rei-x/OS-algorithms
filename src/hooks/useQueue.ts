import { useSnapshot } from "valtio";
import { createCPU } from "@/lib/CPU";
import { createQueue } from "@/lib/Queue";

const cpuProxy = createCPU({ speed: 1 });
const queueProxy = createQueue({ cpu: cpuProxy });

export const useQueue = () => {
  const cpu = useSnapshot(cpuProxy);
  const queue = useSnapshot(queueProxy);

  return { cpu, queue };
};

import { useSnapshot } from "valtio";
import { createCPU } from "@/lib/CPU";
import { createRoundRobin } from "@/lib/RoundRobin";

const cpuProxy = createCPU({ speed: 1 });
const queueProxy = createRoundRobin({ cpu: cpuProxy });

export const useRoundRobin = () => {
  const RoundRobin = useSnapshot(queueProxy);

  return { RoundRobin };
};

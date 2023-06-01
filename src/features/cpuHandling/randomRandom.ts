import { CPU, Process, random } from ".";
import { pThreshold, zLimit } from "./config";

export const randomRandomStrategy = (cpus: CPU[], processes: Process[]) => {
  const randomProcess = processes[random(0, processes.length - 1)];

  const cpuThatHasGotTheTask = cpus[random(0, cpus.length - 1)];

  let cpuToAsk = cpus.filter((cpu) => cpu !== cpuThatHasGotTheTask)[
    random(0, cpus.length - 2)
  ];
  let loopLimit = 0;
  while (cpuToAsk.load > pThreshold && loopLimit <= zLimit) {
    cpuToAsk = cpus.filter((cpu) => cpu !== cpuThatHasGotTheTask)[
      random(0, cpus.length - 2)
    ];
    loopLimit++;
  }

  if (
    loopLimit <= zLimit &&
    cpuToAsk.load + randomProcess.requiredLoad <= 100
  ) {
    cpuToAsk.addProcess(randomProcess);
  } else {
    if (cpuThatHasGotTheTask.load + randomProcess.requiredLoad <= 100) {
      cpuThatHasGotTheTask.addProcess(randomProcess);
    }
  }
};

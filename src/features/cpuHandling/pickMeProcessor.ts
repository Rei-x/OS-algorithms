import { CPU, Process, random } from ".";
import { pThreshold, rMin, zLimit } from "./config";

export const pickMeProcessorStrategy = (cpus: CPU[], processes: Process[]) => {
  const randomProcess = processes[random(0, processes.length - 1)];

  const cpuThatHasGotTheTask = cpus[random(0, cpus.length - 1)];
  const cpuLoad = cpuThatHasGotTheTask.load;
  if (cpuLoad < pThreshold && cpuLoad + randomProcess.requiredLoad <= 100) {
    cpuThatHasGotTheTask.addProcess(randomProcess);
  } else {
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
    }
  }

  cpus
    .filter((cpu) => cpu.load < rMin)
    .forEach((cpu) => {
      const filteredCpus = cpus.filter((c) => c !== cpu);

      for (const newCpu of filteredCpus) {
        if (newCpu.load > pThreshold) {
          const procThatCanBeTaken = newCpu.processes.find(
            (proc) => proc.requiredLoad + cpu.load <= 100
          );
          if (procThatCanBeTaken) {
            cpu.addProcess(procThatCanBeTaken);
          }

          if (cpu.load >= rMin) {
            break;
          }
        }
      }
    });
};

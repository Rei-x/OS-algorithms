import { LRU } from "@/features/ram/lib/LRU";
import {
  numberOfAvailableFrames,
  numberOfProcesses,
  numberOfPages,
  procesRequests,
  processRequestsRandomly,
  logging,
  random,
  maxRange,
} from ".";
import chalk from "chalk";

export const proportionalAllocation = () => {
  const processes = [] as LRU[];

  const rangeOfLocalRequestsMap = new Map<LRU, number>();

  let leftFrames = numberOfAvailableFrames;

  for (let i = 0; i < numberOfProcesses; i++) {
    const rangeOfLocalRequests = random(1, maxRange);

    let framesToAllocate = Math.max(
      1,
      rangeOfLocalRequests + (random(1, 2) == 2 ? 1 : -1) * random(1, 5)
    );

    if (framesToAllocate + numberOfProcesses - i - 1 > leftFrames) {
      framesToAllocate = 1;
    }

    leftFrames -= framesToAllocate;

    processes.push(
      new LRU(numberOfPages, framesToAllocate, [...procesRequests[i]])
    );

    rangeOfLocalRequestsMap.set(processes[i], rangeOfLocalRequests);
  }
  processRequestsRandomly(processes);

  console.log(chalk.bgRedBright("Proportional allocation"));
  logging({ processes });
};

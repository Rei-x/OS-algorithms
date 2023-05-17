import { LRU } from "@/features/ram/lib/LRU";
import {
  numberOfProcesses,
  numberOfAvailableFrames,
  numberOfPages,
  processRequestsRandomly,
  logging,
  procesRequests,
} from "./index";
import chalk from "chalk";

export const equalAllocation = () => {
  const processes = [] as LRU[];

  for (let i = 0; i < numberOfProcesses; i++) {
    const availableFrames = Math.floor(
      numberOfAvailableFrames / numberOfProcesses
    );

    processes.push(
      new LRU(numberOfPages, availableFrames, [...procesRequests[i]])
    );
  }
  processRequestsRandomly(processes);
  logging({ processes, name: "Equal allocation" });
};

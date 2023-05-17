import { LRU } from "@/features/ram/lib/LRU";
import {
  numberOfProcesses,
  numberOfAvailableFrames,
  numberOfPages,
  procesRequests,
  processRequestsRandomly,
  logging,
} from ".";
import chalk from "chalk";

const lastRequests = new Map<LRU, string[]>();

const deltaTime = 12;

const getProcessScore = (process: LRU) => {
  const lastRequest = lastRequests.get(process);

  if (!lastRequest) {
    return 0;
  }

  const lastRequestSet = new Set(lastRequest);

  return lastRequestSet.size;
};

export const segmentControl = () => {
  const processes = [] as LRU[];

  for (let i = 0; i < numberOfProcesses; i++) {
    const availableFrames = Math.floor(
      numberOfAvailableFrames / numberOfProcesses
    );

    processes.push(
      new LRU(numberOfPages, availableFrames, [...procesRequests[i]])
    );
  }
  processRequestsRandomly(processes, (process) => {
    const nextRequest = process.requests.at(0);

    if (!nextRequest) {
      return;
    }

    if (!lastRequests.has(process)) {
      lastRequests.set(process, []);
    }

    const lastRequest = lastRequests.get(process) as string[];

    if (lastRequest.length === deltaTime) {
      lastRequest.shift();
    }

    lastRequest.push(nextRequest);

    // while (process.numberOfFrames > getProcessScore(process)) {
    //   const processWithLowestScore = processes
    //     .filter((proc) => proc.numberOfFrames > 1)
    //     .sort((a, b) => getProcessScore(b) - getProcessScore(a))
    //     .at(0);

    //   if (!processWithLowestScore) {
    //     return;
    //   }
    //   if (processWithLowestScore === process) {
    //     return;
    //   }

    //   process.numberOfFrames--;
    //   processWithLowestScore.numberOfFrames++;

    //   process.frames = process.frames.filter(
    //     (frame) => frame !== process.getLeastUsedPage().id
    //   );
    // }

    while (process.numberOfFrames < getProcessScore(process)) {
      const processWithHighestScore = processes
        .filter((proc) => proc.numberOfFrames > 1)
        .sort((a, b) => getProcessScore(a) - getProcessScore(b))
        .at(0);

      if (!processWithHighestScore) {
        return;
      }
      if (processWithHighestScore === process) {
        return;
      }

      process.numberOfFrames++;
      processWithHighestScore.numberOfFrames--;

      processWithHighestScore.frames = processWithHighestScore.frames.filter(
        (frame) => frame !== processWithHighestScore.getLeastUsedPage().id
      );
    }
  });
  logging({ processes, name: "Segment control" });
};

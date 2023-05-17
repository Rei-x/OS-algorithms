import { LRU } from "@/features/ram/lib/LRU";
import {
  numberOfProcesses,
  numberOfAvailableFrames,
  numberOfPages,
  procesRequests,
  processRequestsRandomly,
  logging,
} from "./index";
import chalk from "chalk";

export const pageFaultRateControl = () => {
  const processes = [] as LRU[];

  const maxPF = 0.2;
  const minPF = 0.1;

  for (let i = 0; i < numberOfProcesses; i++) {
    const availableFrames = Math.floor(
      numberOfAvailableFrames / numberOfProcesses
    );

    processes.push(
      new LRU(numberOfPages, availableFrames, [...procesRequests[i]])
    );
  }
  let index = 0;
  processRequestsRandomly(processes, (process) => {
    if (process.getPageFaultRatio() > maxPF) {
      const processWithBestPageFaultRatio = processes
        .filter((proc) => proc.numberOfFrames > 1)
        .sort((a, b) => a.getPageFaultRatio() - b.getPageFaultRatio())
        .at(0);

      if (!processWithBestPageFaultRatio) {
        return;
      }
      if (processWithBestPageFaultRatio === process) {
        return;
      }

      process.numberOfFrames++;
      processWithBestPageFaultRatio.numberOfFrames--;

      const newFrames = processWithBestPageFaultRatio.frames.filter(
        (frame) => frame !== processWithBestPageFaultRatio.getLeastUsedPage().id
      );

      processWithBestPageFaultRatio.frames = newFrames;
    }

    if (process.getPageFaultRatio() < minPF) {
      const processWithWorstPageFaultRatio = processes
        .filter((proc) => proc.numberOfFrames > 1)
        .sort((a, b) => b.getPageFaultRatio() - a.getPageFaultRatio())
        .at(0);

      if (!processWithWorstPageFaultRatio) {
        return;
      }
      if (processWithWorstPageFaultRatio === process) {
        return;
      }

      process.numberOfFrames--;

      processWithWorstPageFaultRatio.numberOfFrames++;

      const newFrames = process.frames.filter(
        (frame) => frame !== process.getLeastUsedPage().id
      );

      process.frames = newFrames;
    }
  });
  logging({ processes, name: "Page Fault Rate Control" });
  // console.log(processes.map((process) => process));
};

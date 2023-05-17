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
  rangeOfLocalRequestsMap,
} from ".";
import chalk from "chalk";
import Table from "cli-table";

export const proportionalAllocation = () => {
  const processes = [] as LRU[];

  let leftFrames = numberOfAvailableFrames - numberOfProcesses;

  const allWantedFrames = rangeOfLocalRequestsMap.reduce(
    (acc, curr) => acc + curr,
    0
  );

  const table = new Table({
    head: ["Process", "Size", "Frames", "Percentage"],
  });

  const rows = [] as string[][];

  for (let i = 0; i < numberOfProcesses; i++) {
    const request = rangeOfLocalRequestsMap.at(i) ?? 1;

    let framesToAllocate =
      Math.round((request / allWantedFrames) * leftFrames) + 1;

    // console.log("Process", i);
    // console.log("Frames needed", request);
    // console.log("Frames allocated", framesToAllocate);

    rows.push([
      i.toString(),
      request.toString(),
      framesToAllocate.toString(),
      `${Math.round((request / allWantedFrames) * 100)}%`,
    ]);

    processes.push(
      new LRU(numberOfPages, framesToAllocate, [...procesRequests[i]])
    );
  }
  processRequestsRandomly(processes);

  rows.sort((a, b) => parseInt(b[2]) - parseInt(a[2]));

  rows.forEach((row) => table.push(row));

  console.log(table.toString());

  logging({ processes, name: "Proportional allocation" });
};

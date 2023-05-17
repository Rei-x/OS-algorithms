import { LRU } from "@/features/ram/lib/LRU";
import seedrandom from "seedrandom";
import { equalAllocation } from "./equal";
import { proportionalAllocation } from "./proportional";
import { pageFaultRateControl } from "./pageFaultRateControl";
import { segmentControl } from "./segmentControl";
import Table from "cli-table";
import chalk from "chalk";

const rng = seedrandom("pieski i koteczki");

const table = new Table({
  head: ["Name", "Page faults", "% of best"],
});

const rows = [] as string[][];

export const random = (min: number, max: number) => {
  return Math.floor(rng() * (max - min + 1)) + min;
};

const generateRequestsForProcess = ({
  numberOfRequests,
  rangeOfLocalRequests = random(1, 10),
}: {
  numberOfRequests: number;
  rangeOfLocalRequests: number;
}) => {
  const requests = [] as string[];

  const upRange = random(
    rangeOfLocalRequests,
    numberOfPages - rangeOfLocalRequests
  );
  const downRange = upRange - rangeOfLocalRequests;

  for (let i = 0; i < numberOfRequests; i++) {
    requests.push(random(downRange, upRange - 1).toString());
  }

  return requests;
};

export const maxRange = 20;
export const numberOfAvailableFrames = 50;
export const numberOfProcesses = 10;
export const numberOfPages = 100;
const numberOfRequests = 1000;
const numberOfSequences = 50;

export const processRequestsRandomly = (
  processes: LRU[],
  beforeRequest?: (process: LRU) => void
) => {
  let processesWithRequests = processes.filter(
    (process) => process.requests.length > 0
  );

  while (processesWithRequests.some((process) => process.requests.length > 0)) {
    const randomProcessWithRequests =
      processesWithRequests[random(0, processesWithRequests.length - 1)];

    for (let i = 0; i < numberOfRequests / numberOfSequences; i++) {
      processesWithRequests = processes.filter(
        (process) => process.requests.length > 0
      );
      if (randomProcessWithRequests.requests.length <= 0) {
        break;
      }

      beforeRequest?.(randomProcessWithRequests);

      randomProcessWithRequests.processRequest();
    }
  }
};
export const rangeOfLocalRequestsMap = [] as number[];

export const logging = ({
  processes,
  name,
}: {
  processes: LRU[];
  name: string;
}) => {
  const totalNumberOfPageFaults = processes.reduce(
    (acc, process) => acc + process.numberOfPageFaults,
    0
  );

  const shouldLogProcesses = false;

  !shouldLogProcesses ??
    processes.slice(1, 3).forEach((process, i) => {
      console.log("Process number ", i + 1);
      console.log("Available frames");
      console.log(process.numberOfFrames);
      console.log("Range");
      console.log(rangeOfLocalRequestsMap.at(i));
      console.log("Number of page faults");
      console.log(process.numberOfPageFaults);
      console.log("Page faults ratio");
      console.log(process.getPageFaultRatio() * 100 + "%");
      console.log("Start of requests");
      console.log(procesRequests.at(i)?.slice(10, 30).join(", "));
      console.log("Highest request");
      console.log(Math.max(...procesRequests[i].map((d) => parseInt(d))));
      console.log("Lowest request");
      console.log(Math.min(...procesRequests[i].map((d) => parseInt(d))));

      console.log(
        chalk.bgGreenBright("............................................")
      );
    });

  // console.log("Total number of page faults");
  // console.log(chalk.bold.bgBlack(`${totalNumberOfPageFaults}`));

  // // console.log("Control sum of available pages");
  // // console.log(
  // //   `${processes.reduce((acc, cur) => {
  // //     return acc + cur.numberOfFrames;
  // //   }, 0)}`
  // // );
  // console.log("");

  rows.push([name, totalNumberOfPageFaults.toString(), ""]);
};

export const procesRequests = Array.from({ length: numberOfProcesses }).map(
  () => {
    const rangeOfLocalRequests = random(1, maxRange);

    rangeOfLocalRequestsMap.push(rangeOfLocalRequests);

    return generateRequestsForProcess({
      numberOfRequests,
      rangeOfLocalRequests,
    });
  }
);

equalAllocation();
proportionalAllocation();
pageFaultRateControl();
segmentControl();

rows.sort((a, b) => {
  return parseInt(a[1]) - parseInt(b[1]);
});

rows.forEach((row, i) => {
  row[2] = ((parseInt(row[1]) / parseInt(rows[0][1])) * 100).toFixed(2) + "%";
});

// rows.forEach((row) => {
//   row[2] = chalk.bold(row[2]);
// });

table.push(...rows);
console.log(table.toString());

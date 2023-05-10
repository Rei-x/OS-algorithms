import { LRU } from "@/features/ram/lib/LRU";
import seedrandom from "seedrandom";

const numberOfPages = 1000;

const rng = seedrandom("pieski i koteczki");

const random = (min: number, max: number) => {
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
    requests.push(random(downRange, upRange).toString());
  }

  return requests;
};

const maxRange = 50;
const numberOfAvailableFrames = 50;
const numberOfProcesses = 25;
const numberOfRequests = 10000;
const numberOfSequences = 1;

const processesSequence = [] as number[];

const processRequestsRandomly = (
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
const rangeOfLocalRequestsMap = [] as number[];

const logging = ({ processes }: { processes: LRU[] }) => {
  const totalNumberOfPageFaults = processes.reduce(
    (acc, process) => acc + process.numberOfPageFaults,
    0
  );

  // processes.forEach((process, i) => {
  //   console.log("Process number ", i + 1);
  //   console.log("Available frames");
  //   console.log(process.numberOfFrames);
  //   console.log("Range");
  //   console.log(rangeOfLocalRequestsMap.at(i));
  //   console.log("Number of page faults");
  //   console.log(process.numberOfPageFaults);
  //   console.log("Page faults ratio");
  //   console.log(process.getPageFaultRatio() * 100 + "%");
  // });

  console.log("Total number of page faults");
  console.log(totalNumberOfPageFaults);
};

const procesRequests = Array.from({ length: numberOfProcesses }).map(() => {
  const rangeOfLocalRequests = random(1, maxRange);

  rangeOfLocalRequestsMap.push(rangeOfLocalRequests);

  return generateRequestsForProcess({
    numberOfRequests,
    rangeOfLocalRequests,
  });
});

const equalAllocation = () => {
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
  console.log("Equal allocation");
  logging({ processes });
};

const proportionalAllocation = () => {
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

  console.log("Proportional allocation");
  logging({ processes });
};

const pageFaultRateControl = () => {
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
        console.log("nie ma xd");
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

      if (process.frames.length === newFrames.length) {
        throw new Error("nie ma xd");
      }

      process.frames = newFrames;
    }
  });
  console.log("Page fault rate control");
  logging({ processes });
  // console.log(processes.map((process) => process));
};

equalAllocation();
proportionalAllocation();
pageFaultRateControl();

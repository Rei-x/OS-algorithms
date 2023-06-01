import seedrandom from "seedrandom";
import { randomRandomStrategy } from "./randomRandom";
import { overPThenAdiosStrategy } from "./overPThenAdios";
import { pickMeProcessorStrategy } from "./pickMeProcessor";
import { get } from "http";
import Table from "cli-table";

export class Process {
  requiredLoad: number;
  time: number;
  numberOfMovements: number;

  constructor(requiredLoad: number, time: number) {
    this.requiredLoad = requiredLoad;
    this.time = time;
    this.numberOfMovements = 0;
  }

  decreaseTime() {
    this.time--;
  }

  get done() {
    return this.time <= 0;
  }

  move() {
    this.numberOfMovements++;
  }
}

export class CPU {
  processes: Process[];
  loadHistory: number[];

  numberOfLoadQueries: number;

  constructor() {
    this.processes = [];
    this.loadHistory = [];
    this.numberOfLoadQueries = 0;
  }

  addProcess(process: Process) {
    process.move();
    this.processes.push(process);
  }

  removeProcess(process: Process) {
    this.processes = this.processes.filter((p) => p !== process);
    process.move();

    return process;
  }

  get load() {
    this.numberOfLoadQueries++;

    const newload = this.processes.reduce((acc, process) => {
      return acc + process.requiredLoad;
    }, 0);

    if (newload > 100) {
      console.log("xd", newload);
    }

    return newload;
  }

  doCycle() {
    this.processes.at(0)?.decreaseTime();
    this.processes = this.processes.filter((process) => !process.done);
    this.loadHistory.push(this.load);
    this.numberOfLoadQueries--;
  }

  get averageLoad() {
    return (
      this.loadHistory.reduce((acc, load) => acc + load, 0) /
      this.loadHistory.length
    );
  }
}

let rng: () => number;

const resetRng = () => {
  rng = seedrandom("pieski i koteczki");
};

export const random = (min: number, max: number) => {
  return Math.floor(rng() * (max - min + 1)) + min;
};

let time = 0;

const resetTime = () => {
  time = 0;
};

const numberOfCpus = 10;

let cpus = [] as CPU[];

const resetCpus = () => {
  cpus = [];

  for (let i = 0; i < numberOfCpus; i++) {
    cpus.push(new CPU());
  }
};

const numberOfProcesses = 1000;

let processes = [] as Process[];

const resetProcesses = () => {
  processes = [];

  for (let i = 0; i < numberOfProcesses; i++) {
    processes.push(new Process(random(1, 100), random(1, 1000)));
  }
};

const runStrategy = (strategy: (cpus: CPU[], processes: Process[]) => void) => {
  resetRng();
  resetCpus();
  resetProcesses();
  resetTime();

  while (processes.some((process) => !process.done)) {
    const shouldAddNewProcess = random(0, 100) < 80;

    if (shouldAddNewProcess) {
      strategy(cpus, processes);
    }

    time++;

    cpus.forEach((cpu) => cpu.doCycle());
  }

  return { cpus, time, processes };
};

const getAverageDeviationForStrategy = (cpus: CPU[]) => {
  const averageLoad =
    cpus.reduce((acc, cpu) => acc + cpu.averageLoad, 0) / cpus.length;

  return (
    cpus.reduce(
      (acc, cpu) => acc + Math.abs(cpu.averageLoad - averageLoad),
      0
    ) / cpus.length
  );
};

const getAverageLoadForStrategy = (cpus: CPU[]) => {
  return cpus.reduce((acc, cpu) => acc + cpu.averageLoad, 0) / cpus.length;
};

const getSumOfLoadQueriesForStrategy = (cpus: CPU[]) => {
  return cpus.reduce((acc, cpu) => acc + cpu.numberOfLoadQueries, 0);
};

const getNumberOfMovements = (processss: Process[]) => {
  return processss.reduce((acc, proc) => acc + proc.numberOfMovements, 0);
};

const rows = [] as string[][];

const randomRandom = runStrategy(randomRandomStrategy);

const randomRandomRow = ["1"];

randomRandomRow.push(
  getSumOfLoadQueriesForStrategy(randomRandom.cpus).toString()
);
randomRandomRow.push(
  getAverageLoadForStrategy(randomRandom.cpus).toFixed(2) + "%"
);
randomRandomRow.push(
  getAverageDeviationForStrategy(randomRandom.cpus).toFixed(2) + "%"
);
randomRandomRow.push(getNumberOfMovements(randomRandom.processes).toString());

const overPThenAdiosRow = ["2"];

const overPThenAdios = runStrategy(overPThenAdiosStrategy);

overPThenAdiosRow.push(
  getSumOfLoadQueriesForStrategy(overPThenAdios.cpus).toString()
);
overPThenAdiosRow.push(
  getAverageLoadForStrategy(overPThenAdios.cpus).toFixed(2) + "%"
);
overPThenAdiosRow.push(
  getAverageDeviationForStrategy(overPThenAdios.cpus).toFixed(2) + "%"
);
overPThenAdiosRow.push(
  getNumberOfMovements(overPThenAdios.processes).toString()
);

const pickMeProcessor = runStrategy(pickMeProcessorStrategy);

const pickMeProcessorRow = ["3"];

pickMeProcessorRow.push(
  getSumOfLoadQueriesForStrategy(pickMeProcessor.cpus).toString()
);
pickMeProcessorRow.push(
  getAverageLoadForStrategy(pickMeProcessor.cpus).toFixed(2) + "%"
);
pickMeProcessorRow.push(
  getAverageDeviationForStrategy(pickMeProcessor.cpus).toFixed(2) + "%"
);
pickMeProcessorRow.push(
  getNumberOfMovements(pickMeProcessor.processes).toString()
);

const table = new Table({
  head: ["ALG", "Ilość zapytań", "Średnie obciążenie", "Odchylenie", "moves"],
});

rows.push(randomRandomRow, overPThenAdiosRow, pickMeProcessorRow);

// rows.sort((a, b) => {
//   return parseInt(a[1]) - parseInt(b[1]);
// });

// rows.forEach((row, i) => {
//   row[2] = (parseInt(row[1]) / parseInt(rows[0][1])).toFixed(2) + "%";
// });

table.push(...rows);

console.log(table.toString());

import { FIFO } from "./FIFO";
import seedrandom from "seedrandom";
import { RAND } from "./RAND";
import { OPT } from "./OPT";
import { LRU } from "./LRU";
import { ALRU } from "./ALRU";

const numberOfPages = 2000;
const numberOfFrames = 10;

const requests = [] as string[];

const rng = seedrandom("seed123");

const random = (min: number, max: number) => {
  return Math.floor(rng() * (max - min + 1)) + min;
};

const numberOfProcesses = 30;
const rangeOfLocalRequests = 20;
const numberOfRequests = 100;

for (let i = 0; i < numberOfProcesses; i++) {
  const upRange = random(rangeOfLocalRequests, numberOfPages - rangeOfLocalRequests);
  const downRange = upRange - rangeOfLocalRequests;

  for (let i = 0; i < numberOfRequests; i++) {
    requests.push(random(downRange, upRange).toString());
  }
}

const strategies = [FIFO, RAND, OPT, LRU, ALRU];

console.log(requests);

strategies.forEach((Strategy) => {
  const ram = new Strategy(numberOfPages, numberOfFrames, requests);
  ram.processRequests();
  console.log(Strategy.name);
  console.log(ram.numberOfPageFaults);
})

import { CPU, createCPU } from "./CPU";
import { createProcess } from "./Process";
import { createQueue } from "./Queue";

describe("Queue", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = createCPU({ speed: 1 });
  });

  it("should add a process to the queue", () => {
    const queue = createQueue({ cpu });
    const process = createProcess({ length: 10 });
    queue.addProcess(process);
    expect(queue.getProcesses()).toEqual([process]);
  });
});

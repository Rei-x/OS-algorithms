import { Ram } from "./Ram";
import seedrandom from "seedrandom";

const rng = seedrandom("JAK TO NIBY DZIALA XD");

export class RAND extends Ram {
  replaceFrame(pageId: string): string {
    const leastRequestFrame = this.frames.reduce((acc, frame) => {
      const frameRequest = this.requests.indexOf(frame, this.time);
      const accRequest = this.requests.indexOf(acc, this.time);

      let realFrameRequest = frameRequest === -1 ? Infinity : frameRequest;
      let realAccRequest = accRequest === -1 ? Infinity : accRequest;
      return realFrameRequest < realAccRequest ? frame : acc;
    }, this.frames[0]);

    const frameToRemove = this.frames.indexOf(leastRequestFrame);

    const frame = this.frames[frameToRemove];

    if (!frame) {
      throw new Error("Frame not found");
    }

    // console.log("Requested page: ", pageId);
    // console.log("Current frames: ", this.frames);
    // console.log("Frame to remove: ", frame);

    this.frames[frameToRemove] = pageId;

    return frame;
  }
}

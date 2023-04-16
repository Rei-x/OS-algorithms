import { Ram } from "./Ram";
import seedrandom from "seedrandom";

const rng = seedrandom("JAK TO NIBY DZIALA XD");

export class RAND extends Ram {

  replaceFrame(pageId: string): string {
    const frameToRemove = Math.floor(rng() * this.frames.length);
    
    const frame = this.frames[frameToRemove];

    // console.log("Requested page: ", pageId);
    // console.log("Current frames: ", this.frames);
    // console.log("Frame to remove: ", frame);

    if (!frame) {
      throw new Error("Frame not found");
    }

    this.frames[frameToRemove] = pageId;

    return frame;
  }
}
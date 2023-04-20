import { Ram } from "./Ram";
import seedrandom from "seedrandom";

const rng = seedrandom("JAK TO NIBY DZIALA sadsadasdas XD");

export class RAND extends Ram {
  replaceFrame(pageId: string): string {
    const frameToReplace = Math.floor(rng() * this.frames.length);

    this.frames[frameToReplace] = pageId;

    return pageId;
  }
}

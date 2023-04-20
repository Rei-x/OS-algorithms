import { Ram } from "./Ram";

export class FIFO extends Ram {
  replaceFrame(pageId: string): string {
    const pages = this.getPagesInFrames();

    let pageTheLongestInRam = pages[0];
    for (const page of pages) {
      if (pageTheLongestInRam.arriveTime === null || page.arriveTime === null) {
        throw new Error("nie dziala");
      }

      if (pageTheLongestInRam.arriveTime > page.arriveTime) {
        pageTheLongestInRam = page;
      }
    }

    if (pageTheLongestInRam.arriveTime === null) {
      throw new Error("Frame not found");
    }

    const frameToRemove = this.frames.indexOf(pageTheLongestInRam.id);

    // console.log("Requested page: ", pageId);
    // console.log("Current frames: ", this.frames);
    // console.log("Frame to remove: ", pageTheLongestInRam.id);

    this.frames[frameToRemove] = pageId;

    return pageId;
  }
}

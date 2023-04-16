import { Ram } from "./Ram";

export class FIFO extends Ram {

  replaceFrame(pageId: string): string {
    const pageTheLongestInRam = this.pages.reduce((acc, page) => {
      if (page.id === pageId) {
        return acc;
      }

      if (page.arriveTime === null) {
        return acc;
      }

      return page.arriveTime < (acc.arriveTime ?? Infinity) ? page : acc;
    }, this.pages[0]);

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
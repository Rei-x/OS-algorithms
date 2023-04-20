import { Ram } from "./Ram";

let shift = 0;

export class ALRU extends Ram {
  replaceFrame(pageId: string): string {
    const pages = this.getPagesInFrames();

    let pageTheLongestInRam = pages[0];

    for (let i = pages.length - 1; i > 0; i--) {
      const page = pages[i];
      pageTheLongestInRam = page;
      if (page.bit === 0) {
        break;
      }
    }

    // console.log("Requested page: ", pageId);
    // console.log("Current frames: ", this.frames);
    // console.log("Frame to remove: ", pageTheLongestInRam.id);

    const frameToRemove = this.frames.indexOf(pageTheLongestInRam.id);

    if (frameToRemove === -1) {
      throw new Error("baaad");
    }

    this.frames[frameToRemove] = pageId;

    this.pages.forEach((page) => page.setBit(0));

    const newPage = this.pages.find((page) => page.id === pageId);

    if (!newPage) {
      throw new Error("Page not found");
    }
    newPage.setBit(1);
    return pageId;
  }
}

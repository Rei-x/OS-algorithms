import { Ram } from "./Ram";

export class LRU extends Ram {
  replaceFrame(pageId: string): string {
    const pages = this.getPagesInFrames();

    let pageTheLongestInRam = pages[0];
    for (const page of pages) {
      if (
        pageTheLongestInRam.lastUsedTime === null ||
        page.lastUsedTime === null
      ) {
        throw new Error("nie dziala");
      }

      if (pageTheLongestInRam.lastUsedTime > page.lastUsedTime) {
        pageTheLongestInRam = page;
      }
    }

    if (pageTheLongestInRam.lastUsedTime === null) {
      throw new Error("Frame not found");
    }

    const frameToRemove = this.frames.indexOf(pageTheLongestInRam.id);

    this.frames[frameToRemove] = pageId;

    const newPage = this.getPage(pageId);

    newPage.lastUsedTime = this.time;
    newPage.arriveTime = this.time;

    return pageId;
  }
}

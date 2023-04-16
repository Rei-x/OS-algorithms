import { Ram } from "./Ram";

export class LRU extends Ram {

  replaceFrame(pageId: string): string {
    const pageTheLongestInRam = this.pages.reduce((acc, page) => {
      if (page.lastUsedTime === null) {
        return acc;
      }

      return page.lastUsedTime < (acc.lastUsedTime ?? Infinity) ? page : acc;
    }, this.pages[0]);

    if (pageTheLongestInRam.lastUsedTime === null) {
      throw new Error("Frame not found");
    }

    const frameToRemove = this.frames.indexOf(pageTheLongestInRam.id);

    this.frames[frameToRemove] = pageId;

    return pageId;
  }
}
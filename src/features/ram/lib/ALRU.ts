import { Ram } from "./Ram";

export class ALRU extends Ram {

  replaceFrame(pageId: string): string {
    const pageTheLongestInRam = this.pages.find((page) => page.bit === 0) ?? this.pages[0];
    pageTheLongestInRam.reset();

    const frameToRemove = this.frames.indexOf(pageTheLongestInRam.id);

    this.frames.forEach((frame) => this.pages.find((page) => page.id === frame)?.setBit(0));

    this.frames[frameToRemove] = pageId;

    const newPage = this.pages.find((page) => page.id === pageId);

    // console.log("Requested page: ", pageId);
    // console.log("Current frames: ", this.frames);
    // console.log("Frame to remove: ", pageTheLongestInRam.id);

    if (!newPage) {
      throw new Error("Page not found");
    }
    newPage.setBit(1);
    return pageId;
  }
}
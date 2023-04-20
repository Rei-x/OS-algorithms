import { Ram } from "./Ram";

export class ALRU extends Ram {
  replaceFrame(pageId: string): string {
    // console.log("Requested page: ", pageId);
    // console.log(
    //   "Current frames: ",
    //   this.frames.map(
    //     (frame) =>
    //       `${frame}:${this.pages.find((page) => page.id === frame)?.bit}`
    //   )
    // );

    const pageTheLongestInRam = this.pages.find((page) => page.bit === 0) ?? {
      id: this.frames[0],
      reset: () => null,
    };
    pageTheLongestInRam.reset();

    const frameToRemove = this.frames.indexOf(pageTheLongestInRam.id);

    // if (frameToRemove === -1) {
    //   console.error("wtf??");
    // }

    this.frames[frameToRemove === -1 ? 0 : frameToRemove] = pageId;

    this.frames.forEach((frame) =>
      this.pages.find((page) => page.id === frame)?.setBit(0)
    );

    const newPage = this.pages.find((page) => page.id === pageId);

    // console.log("Frame to remove: ", pageTheLongestInRam.id);

    if (!newPage) {
      throw new Error("Page not found");
    }
    newPage.setBit(1);
    return pageId;
  }
}

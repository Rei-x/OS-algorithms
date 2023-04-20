import { Page } from "./Page";

export abstract class Ram {
  numberOfPages: number;
  numberOfFrames: number;
  time: number;

  pages: Page[];
  numberOfPageFaults: number;

  frames: string[];

  requests: string[];

  constructor(
    numberOfPages: number,
    numberOfFrames: number,
    requests: string[]
  ) {
    this.numberOfPages = numberOfPages;
    this.numberOfFrames = numberOfFrames;
    this.pages = [];
    this.frames = [];
    this.numberOfPageFaults = 0;
    this.time = 0;

    this.requests = requests;

    for (let i = 0; i < numberOfPages; i++) {
      this.pages.push(new Page(i.toString()));
    }
  }

  loadPage(pageId: string): void {
    const page = this.pages.find((page) => page.id === pageId);

    if (!page) {
      throw new Error("Page not found");
    }

    this.pageFault();
    page.arriveTime = this.time;
    page.lastUsedTime = this.time;
    page.setBit(1);
    this.frames.push(pageId);
  }

  private getPage(pageId: string): Page {
    const page = this.pages.find((page) => page.id === pageId);
    if (!page) {
      throw new Error("Page not found");
    }

    return page;
  }

  getFrame(pageId: string): string {
    this.time++;

    const page = this.getPage(pageId);

    const frame = this.frames.find((frame) => frame === pageId);
    if (frame) {
      page.setBit(1);
      page.lastUsedTime = this.time;

      return frame;
    }

    if (this.frames.length < this.numberOfFrames) {
      this.loadPage(pageId);
      return pageId;
    }

    this.pageFault();

    page.arriveTime = this.time;
    page.lastUsedTime = this.time;
    return this.replaceFrame(pageId);
  }

  pageFault(): void {
    this.numberOfPageFaults++;
  }

  processRequests(): void {
    this.requests.forEach((request) => {
      this.getFrame(request);
    });
  }

  abstract replaceFrame(pageId: string): string;
}

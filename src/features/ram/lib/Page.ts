export class Page {
  id: string;
  arriveTime: number | null;

  lastUsedTime: number | null;
  bit: -1 | 0 | 1;


  constructor(id: string) {
    this.id = id;
    this.arriveTime = null;
    this.lastUsedTime = null;
    this.bit = -1;
  }

  setBit(bit: -1 | 0 | 1): void {
    this.bit = bit;
  }

  reset(): void {
    this.arriveTime = null;
    this.lastUsedTime = null;
    this.bit = -1;
  }
}

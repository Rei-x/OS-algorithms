import { Ram } from "./Ram";

export interface RamStrategy {
  constructor (ram: Ram): void;
  replacePage: (page: string) => void;
}
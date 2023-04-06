import { proxy } from "valtio";
import { Segment } from "./segment";

export const createDisk = () => {
  const state = proxy({
    segments: [] as Segment[],
    currentSegment: null as Segment | null,
    currentPosition: 0,
    moveAmount: 0,
    jumpToSegment: (numberOfSegment: number) => {
      state.currentSegment = state.segments.at(numberOfSegment) ?? null;

      
    },
  });

  return state;
};

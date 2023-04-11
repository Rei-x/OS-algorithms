import { proxy } from "valtio";
import { Segment } from "./segment";

export const createDisk = ({ segments }: { segments: Segment[] }) => {
  const state = proxy({
    segments,
    currentSegment: null as Segment | null,
    currentPosition: 40,
    previousPosition: 0,
    currentDifference: 0,
    moveAmount: 0,
    jumpToPosition: (position: number) => {
      state.previousPosition = state.currentPosition;
      state.currentSegment = state.segments.at(position) ?? null;
      state.currentPosition = position;
      state.currentDifference = Math.abs(
        state.currentPosition - state.previousPosition
      );
      state.moveAmount += state.currentDifference;
    },

    getCurrentSegment: () => {
      return state.currentSegment;
    },
    getSegmentAtPosition: (position: number) => {
      return state.segments.at(position);
    },
    getCurrentPosition: () => {
      return state.currentPosition;
    },
  });

  return state;
};

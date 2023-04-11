import { useMemo } from "react";
import { useDisk } from "./useDisk";
import { createFCFS } from "../lib/fcfs";
import { useSnapshot } from "valtio";

export const useFCFS = ({ diskSize }: { diskSize?: number }) => {
  const disk = useDisk({ diskSize });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fcfsProxy = useMemo(() => createFCFS({ disk }), []);

  const fcfs = useSnapshot(fcfsProxy);

  return { fcfs, disk };
};

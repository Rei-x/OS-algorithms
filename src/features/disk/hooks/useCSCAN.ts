import { useMemo } from "react";
import { useDisk } from "./useDisk";
import { useSnapshot } from "valtio";
import { createCSCAN } from "../lib/cscan";

export const useCSCAN = ({ diskSize }: { diskSize?: number }) => {
  const disk = useDisk({ diskSize });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cscanProxy = useMemo(() => createCSCAN({ disk }), []);

  const cscan = useSnapshot(cscanProxy);

  return { cscan, disk };
};

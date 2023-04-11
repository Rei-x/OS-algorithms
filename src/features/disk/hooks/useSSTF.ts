import { useMemo } from "react";
import { useDisk } from "./useDisk";
import { useSnapshot } from "valtio";
import { createSSTF } from "../lib/sstf";

export const useSSTF = ({ diskSize }: { diskSize?: number }) => {
  const disk = useDisk({ diskSize });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sstfProxy = useMemo(() => createSSTF({ disk }), []);

  const sstf = useSnapshot(sstfProxy);

  return { sstf, disk };
};

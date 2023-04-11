import { useSnapshot } from "valtio";
import { createDisk } from "../lib/disk";
import { useMemo } from "react";
import { createSegment } from "../lib/segment";

export const useDisk = ({ diskSize = 100 }: { diskSize?: number }) => {
  const diskProxy = useMemo(() => {
    const segments = Array.from({ length: diskSize }, (_, i) =>
      createSegment({ numberOnDisk: i })
    );

    return createDisk({ segments });
  }, [diskSize]);
  const disk = useSnapshot(diskProxy);

  return disk;
};

export type Disk = ReturnType<typeof useDisk>;

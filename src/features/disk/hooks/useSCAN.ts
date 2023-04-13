import { useMemo } from "react";
import { useDisk } from "./useDisk";
import { useSnapshot } from "valtio";
import { createSCAN } from "../lib/scan";

export const useSCAN = ({ diskSize }: { diskSize?: number }) => {
  const disk = useDisk({ diskSize });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scanProxy = useMemo(() => createSCAN({ disk }), []);

  const scan = useSnapshot(scanProxy);

  return { scan, disk };
};

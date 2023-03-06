import React from "react";
import { waiter } from "@/lib/waiter";
import { useSnapshot } from "valtio";
import { Box, Input, Switch, VStack } from "@chakra-ui/react";

export const WaiterController = () => {
  const snap = useSnapshot(waiter);
  return (
    <Box>
      <VStack>
        <Input
          value={snap.tickValue}
          type="number"
          onChange={(e) => (waiter.tickValue = e.currentTarget.valueAsNumber)}
        />
        <Switch
          isChecked={snap.shouldWait}
          onChange={() => (waiter.shouldWait = !snap.shouldWait)}
        />
      </VStack>
    </Box>
  );
};

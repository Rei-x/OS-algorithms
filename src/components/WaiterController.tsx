import React from "react";
import { waiter } from "@/lib/waiter";
import { useSnapshot } from "valtio";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Switch,
  VStack,
} from "@chakra-ui/react";
import { useRoundRobinSettings } from "@/hooks/useRoundRobin";
import { NumberInput } from "./NumberInput";

export const WaiterController = () => {
  const snap = useSnapshot(waiter);
  const timeQuantom = useRoundRobinSettings();
  return (
    <Box>
      <VStack>
        <Heading pt="4" pb="2" alignSelf="start" size="sm">
          Ogólne
        </Heading>
        <FormControl isDisabled={!snap.shouldWait}>
          <FormLabel>
            Długość okna czasu
            <NumberInput
              max={1000}
              step={50}
              value={snap.tickValue}
              min={100}
              onChange={(_, number) => snap.setTickValue(number)}
            />
          </FormLabel>
          <FormHelperText>Jak często kolejka się odświeża</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Animacja</FormLabel>
          <Switch
            isChecked={snap.shouldWait}
            onChange={() => snap.setShouldWait(!snap.shouldWait)}
          />
          <FormHelperText>
            Animacja dodawania procesów i ich przetwarzania
          </FormHelperText>
        </FormControl>
        <Heading pt="8" pb="2" alignSelf="start" size="sm">
          RoundRobin
        </Heading>
        <FormControl>
          <FormLabel>
            Time quantum
            <NumberInput
              max={snap.tickValue * 10}
              step={snap.tickValue}
              value={timeQuantom.jumpEveryXTicks * snap.tickValue}
              min={snap.tickValue}
              onChange={(_, number) =>
                timeQuantom.setJumpEveryXTicks(number / snap.tickValue)
              }
            />
          </FormLabel>
          <FormHelperText>
            Co jaki czas ma nastąpić przełączenie procesu
          </FormHelperText>
        </FormControl>
      </VStack>
    </Box>
  );
};

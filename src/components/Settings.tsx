import { useProcessSettings } from "@/hooks/useProcessSettings";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { NumberInput } from "./NumberInput";
import { Slider } from "./Slider";
import { WaiterController } from "./WaiterController";

export const Settings = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const format = (val: number) => `${val}s`;
  const parse = (val: string) => parseInt(val.replaceAll("s", "")) ?? 1;
  const processSettings = useProcessSettings();

  return (
    <>
      <Button w="200px" colorScheme="teal" onClick={onOpen}>
        Ustawienia
      </Button>
      <Drawer size="xs" isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Ustawienia</DrawerHeader>
          <DrawerBody>
            <WaiterController />
            <Box w="250px">
              <Heading size="sm" mt={8}>
                Procesy
              </Heading>
              <FormControl mt={2}>
                <FormLabel>Maksymalna długość procesu</FormLabel>
                <NumberInput
                  step={1}
                  min={1}
                  max={15}
                  value={format(processSettings.longProcess / 1000)}
                  onChange={(number) =>
                    processSettings.setLongProcess(parse(number))
                  }
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>
                  Długość procesu <b>krótkiego</b>
                </FormLabel>
                <Slider
                  value={Math.round(
                    (processSettings.shortProcess /
                      processSettings.longProcess) *
                      100
                  )}
                  onChange={(val) =>
                    processSettings.setShortProcess(
                      Math.round((val / 100000) * processSettings.longProcess)
                    )
                  }
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>
                  Długość procesu <b>normalnego</b>
                </FormLabel>
                <Slider
                  value={Math.round(
                    (processSettings.mediumProcess /
                      processSettings.longProcess) *
                      100
                  )}
                  onChange={(val) =>
                    processSettings.setMediumProcess(
                      Math.round((val / 100000) * processSettings.longProcess)
                    )
                  }
                />
              </FormControl>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

import {
  Box,
  Button,
  Divider,
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
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { NumberInput } from "@/components/NumberInput";
import { Slider } from "@/components/Slider";
import { ButtonIcon } from "@/components/ButtonIcon";
import {
  SmallAddIcon,
  CloseIcon,
  ChevronRightIcon,
  DeleteIcon,
} from "@chakra-ui/icons";

export const Settings = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const format = (val: number) => `${val}s`;
  const parse = (val: string) => parseInt(val.replaceAll("s", "")) ?? 1;

  return (
    <>
      <VStack align="end" justify="end" h="100vh">
        <Heading textAlign="left" pt="10" mb="2" size="md">
          Panel kontrolny
        </Heading>
        <ButtonIcon icon={<SmallAddIcon boxSize={4} />}>
          Dodaj krótki proces
        </ButtonIcon>
        <ButtonIcon icon={<SmallAddIcon boxSize={6} />}>
          Dodaj proces
        </ButtonIcon>
        <ButtonIcon icon={<SmallAddIcon boxSize={8} />}>
          Dodaj długi proces
        </ButtonIcon>
        <ButtonIcon colorScheme="red" icon={<CloseIcon boxSize="4" />}>
          Zatrzymaj kolejke
        </ButtonIcon>
        <ButtonIcon icon={<ChevronRightIcon boxSize="4" />}>
          Wystartuj kolejke
        </ButtonIcon>
        <ButtonIcon icon={<DeleteIcon />}>Restart</ButtonIcon>
        <Divider pt="2" />
        <Button w="200px" colorScheme="teal" onClick={onOpen}>
          Ustawienia
        </Button>
      </VStack>
      <Drawer size="xs" isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Ustawienia</DrawerHeader>
          <DrawerBody>
            <Box w="250px">
              <Heading size="sm" mt={8}>
                Procesy
              </Heading>
              <FormControl mt={2}>
                <FormLabel>Maksymalna długość procesu</FormLabel>
                <NumberInput step={1} min={1} max={15} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>
                  Długość procesu <b>krótkiego</b>
                </FormLabel>
                <Slider value={0} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>
                  Długość procesu <b>normalnego</b>
                </FormLabel>
                <Slider value={0} />
              </FormControl>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { WaiterController } from "./WaiterController";

export const Settings = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();

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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

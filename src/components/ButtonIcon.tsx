import { ButtonProps, Button, HStack, Center, Text } from "@chakra-ui/react";
import React from "react";

export const ButtonIcon = ({
  children,
  icon,
  ...props
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
} & ButtonProps) => (
  <Button w="200px" justifyContent="start" {...props}>
    <HStack justify="start">
      <Center w="20px">{icon}</Center>
      <Text>{children}</Text>
    </HStack>
  </Button>
);

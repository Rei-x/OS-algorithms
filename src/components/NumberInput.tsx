import {
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputProps,
  NumberInput as ChakraNumberInput,
} from "@chakra-ui/react";
import React from "react";

export const NumberInput = (props: NumberInputProps) => {
  return (
    <ChakraNumberInput {...props}>
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </ChakraNumberInput>
  );
};

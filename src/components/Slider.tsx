import React from "react";

import {
  Slider as ChakraSlider,
  SliderFilledTrack,
  SliderMark,
  SliderProps,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from "@chakra-ui/react";

export const Slider = (props: SliderProps & { value: number }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  return (
    <ChakraSlider
      id="slider"
      defaultValue={10}
      min={5}
      max={100}
      step={5}
      colorScheme="teal"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      {...props}
    >
      <SliderMark value={25} mt="1" ml="-2.5" fontSize="sm">
        25%
      </SliderMark>
      <SliderMark value={50} mt="1" ml="-2.5" fontSize="sm">
        50%
      </SliderMark>
      <SliderMark value={75} mt="1" ml="-2.5" fontSize="sm">
        75%
      </SliderMark>
      <SliderMark value={100} mt="1" ml="-2.5" fontSize="sm">
        100%
      </SliderMark>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <Tooltip
        hasArrow
        bg="teal.500"
        color="white"
        placement="top"
        isOpen={showTooltip}
        label={`${props.value}%`}
      >
        <SliderThumb />
      </Tooltip>
    </ChakraSlider>
  );
};

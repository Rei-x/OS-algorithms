import { Center, Container, Divider, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <Container maxW="container.lg" h="100vh">
      <Center flexDir="column" h="100%" gap={4}>
        <Heading>Systemy operacyjne</Heading>
        <Text>Autor: Bartosz Gotowski</Text>
        <Divider />
        <Link href="/cpu">Dostęp do procesora</Link>
        <Link href="/dysk">Dostęp do dysku</Link>
      </Center>
    </Container>
  );
};

export default Home;

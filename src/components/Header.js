import { Box, Flex, Heading, Spacer, Button } from '@chakra-ui/react';

const Header = () => {
  return (
    <Flex as="header" p={4} alignItems="center" bg="gray.900" color="white">
      <Box>
        <Heading size="md">CryptoBank</Heading>
      </Box>
      <Spacer />
      <Box>
        <Button colorScheme="blue">Connect Wallet</Button>
      </Box>
    </Flex>
  );
};

export default Header;
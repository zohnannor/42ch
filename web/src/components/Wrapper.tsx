import { Flex, FlexProps } from '@chakra-ui/react';

const Wrapper: React.FC<FlexProps> = ({ children, ...props }) => (
  <Flex mx='auto' maxW='66%' {...props}>
    {children}
  </Flex>
);

export default Wrapper;

import { Box } from '@chakra-ui/react';
import React from 'react';
import Wrapper from '../components/Wrapper';
import { useIsAuth } from '../utils/useIsAuth';

const Settings: React.FC = () => {
  useIsAuth();

  return (
    <Wrapper mt={10}>
      <Box p={7} flex='3' borderWidth='1px' borderRadius='lg'>
        asdad
      </Box>
      <Box p={7} ml={10} flex='7' borderWidth='1px' borderRadius='lg'>
        asdad
      </Box>
    </Wrapper>
  );
};

export default Settings;

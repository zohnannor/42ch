import { Box, Heading, Text, Link, Flex, Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import React from 'react';
import { DarkModeSwitch } from './DarkModeSwitch';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/dist/client/router';
import { isBackend } from '../utils/isBackend';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FiUser, FiSettings } from 'react-icons/fi';
import { IoExitOutline } from 'react-icons/io5';

const NavBar: React.FC = () => {
  const router = useRouter();

  const { data } = useMeQuery({
    skip: isBackend(),
  });

  const [logout, { client }] = useLogoutMutation();

  const navBarItems = data?.me ? (
    <>
      <Menu isLazy>
        <MenuButton mr={2} as={Button} rightIcon={<ChevronDownIcon />}>
          {data.me.firstName} {data.me.lastName}
        </MenuButton>
        <MenuList>
          <NextLink href={`/u/${data.me.id}`}>
            <MenuItem icon={<FiUser />}>
              <Text>Моя страница</Text>
            </MenuItem>
          </NextLink>
          <NextLink href='/settings'>
            <MenuItem icon={<FiSettings />}>
              <Text>Настройки</Text>
            </MenuItem>
          </NextLink>
          <MenuItem
            icon={<IoExitOutline />}
            onClick={() =>
              logout()
                .then(() => client.resetStore())
                .then(() => {
                  router.push('/');
                })
            }
          >
            Выйти
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  ) : (
    <>
      <NextLink href='/register'>
        <Button
          mr={2}
          color='teal.500'
          bg='white'
          _hover={{
            bg: 'whiteAlpha.800',
          }}
        >
          Зарегистрироваться
        </Button>
      </NextLink>
      <NextLink href='/login'>
        <Button variant='outline'>Войти</Button>
      </NextLink>
    </>
  );

  return (
    <Box pos='sticky' top={0} zIndex={999} bgColor='teal.500' w='100%' p={4}>
      <Flex>
        <Flex minW='66%' mx='auto' align='center' justify='space-between'>
          <Heading>
            <NextLink href='/'>
              <Link>42ch.com</Link>
            </NextLink>
          </Heading>
          <Flex align='center'>{navBarItems}</Flex>
        </Flex>
      </Flex>
      <DarkModeSwitch />
    </Box>
  );
};

export default NavBar;

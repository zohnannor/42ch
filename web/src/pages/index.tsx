import { Box, Link, ListItem, OrderedList, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { useUsersQuery } from '../generated/graphql';

const Index = () => {
  const { data, loading } = useUsersQuery();

  return (
    <Box>
      {!data?.users || loading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          <Text>Все юзеры:</Text>
          <OrderedList>
            {data.users.map(({ firstName, lastName, id }) => (
              <ListItem key={id}>
                <NextLink href={`/u/${id}`}>
                  <Link>
                    {firstName} {lastName}
                  </Link>
                </NextLink>
              </ListItem>
            ))}
          </OrderedList>
        </>
      )}
    </Box>
  );
};

export default Index;

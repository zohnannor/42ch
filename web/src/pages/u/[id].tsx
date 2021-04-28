import { Avatar, Flex, SkeletonCircle, SkeletonText, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import Wrapper from '../../components/Wrapper';
import { useUserQuery } from '../../generated/graphql';

interface UserPageProps {}

const UserPage: React.FC<UserPageProps> = () => {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '0';
  const { data, loading } = useUserQuery({ variables: { id } });

  if (!data?.user) {
    return <div>юзер не найден</div>;
  }

  const user = data.user;

  return (
    <>
      {/* {!loading ? <Progress size='xs' isIndeterminate /> : null} */}
      <Wrapper>
        <Flex mt={10} p={10} w='100%' borderWidth='1px' borderRadius='lg'>
          <SkeletonCircle size='2xs' isLoaded={!loading} mr={10}>
            <Avatar size='6xl' />
          </SkeletonCircle>
          <SkeletonText size='2xl' isLoaded={!loading}>
            <Text fontSize='2xl'>
              {user.firstName} {user.lastName}
            </Text>
          </SkeletonText>
        </Flex>
      </Wrapper>
    </>
  );
};

export default UserPage;

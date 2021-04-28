import { Box, Button, Text } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import { toFormikErrors } from '../utils/toFormikErrors';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import InputField from '../components/InputField';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const router = useRouter();
  const [login, { loading }] = useLoginMutation();
  const [showPass, setShowPass] = useState(false);

  return (
    <Box mt={20} p={5} mx='auto' maxW='md' borderWidth='1px' borderRadius='lg'>
      <Text fontSize='2xl'>Войти в аккаунт на 42ch.com</Text>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  me: data?.login.user,
                },
              });
            },
          });
          if (data?.login.errors) {
            setErrors(toFormikErrors<Parameters<typeof setErrors>[0]>(data.login.errors));
          } else if (data?.login.user) {
            router.back();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name='email' placeholder='Email' label='Email' />
            <InputField
              name='password'
              placeholder='Пароль'
              label='Пароль'
              type='password'
              showPass={showPass}
              setShowPass={setShowPass}
            />
            <Button mt={4} type='submit' colorScheme='teal' isLoading={isSubmitting || loading}>
              Войти
            </Button>
          </Form>
        )}
      </Formik>
      <DarkModeSwitch />
    </Box>
  );
};
export default Login;

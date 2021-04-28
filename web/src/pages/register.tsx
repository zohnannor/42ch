import { Box, Button, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import { toFormikErrors } from '../utils/toFormikErrors';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import InputField from '../components/InputField';
import { MeDocument, MeQuery, useRegisterMutation, UsersDocument, UsersQuery } from '../generated/graphql';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const router = useRouter();
  const [register, { loading }] = useRegisterMutation();
  const [showPass, setShowPass] = useState(false);

  return (
    <Box mt={20} p={5} mx='auto' maxW='md' borderWidth='1px' borderRadius='lg'>
      <Text fontSize='2xl'>Зарегистрироваться на 42ch.com</Text>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          repeatPassword: '',
        }}
        validate={({ password, repeatPassword }) => {
          if (password !== repeatPassword) {
            return {
              password: 'Пароли не совпадают',
              repeatPassword: 'Пароли не совпадают',
            };
          } else {
            return;
          }
        }}
        onSubmit={async ({ repeatPassword, ...values }, { setErrors }) => {
          const { data } = await register({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  me: data?.register.user,
                },
              });
              const usersData = cache.readQuery<UsersQuery>({
                query: UsersDocument,
              });

              if (data?.register.user && usersData?.users) {
                console.log([...usersData.users, data.register.user]);
                cache.writeQuery<UsersQuery>({
                  query: UsersDocument,
                  data: {
                    users: [...(usersData.users || []), data.register.user],
                  },
                });
              }
            },
          });
          if (data?.register.errors) {
            setErrors(toFormikErrors<Parameters<typeof setErrors>[0]>(data.register.errors));
          } else if (data?.register.user) {
            router.back();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name='firstName' placeholder='Имя' label='Имя' />
            <InputField name='lastName' placeholder='Фамилия' label='Фамилия' />
            <InputField name='email' placeholder='Email' label='Email' />
            <InputField
              name='password'
              placeholder='Пароль'
              label='Пароль'
              type='password'
              showPass={showPass}
              setShowPass={setShowPass}
            />
            <InputField
              name='repeatPassword'
              placeholder='Повторите пароль'
              label='Повторите пароль'
              type='password'
              showPass={showPass}
              setShowPass={setShowPass}
            />
            <Button mt={4} type='submit' colorScheme='teal' isLoading={isSubmitting || loading}>
              Создать аккаунт
            </Button>
          </Form>
        )}
      </Formik>
      <DarkModeSwitch />
    </Box>
  );
};

export default Register;

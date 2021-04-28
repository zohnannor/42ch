import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import NavBar from '../components/NavBar';

const client = new ApolloClient({
  credentials: 'include',
  uri: process.env.NEXT_PUBLIC_API_URI,
  cache: new InMemoryCache(),
});

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS>
        <NavBar />
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;

import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolver';
import { createConnection } from 'typeorm';
import { User } from './entities/User';
import express from 'express';
import session from 'express-session';
import { AdminResolver } from './resolvers/AdminResolver';
import cors from 'cors';
import argon2 from 'argon2';
import { isProd } from './constants';

(async () => {
  const conn = await createConnection({
    url: process.env.DATABASE_URL,
    type: 'postgres',
    username: 'postgres',
    password: 'postgres',
    logging: !isProd,
    synchronize: !isProd,
    // migrations: [path.join(__dirname, './migrations/*')],
    entities: [User],
  });

  // conn.query('DROP TABLE "user";');

  // User.delete({});

  // await User.create({
  //   firstName: 'Вадик',
  //   lastName: 'Гаджи',
  //   email: 'asd1@asd.asd',
  //   password: await argon2.hash('123!@#qweQWE'),
  // }).save();

  // await User.create({
  //   firstName: 'Гадик',
  //   lastName: 'Ваджи',
  //   email: 'asd2@asd.asd',
  //   password: await argon2.hash('123!@#qweQWE'),
  // }).save();

  const app = express();
  app.use(
    cors({
      credentials: true,
      origin: true,
      // origin: 'http://localhost:3000',
    })
  );
  app.use(
    session({
      name: 'ul',
      secret: 'askjdghkajsghlafh',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, AdminResolver],
    }),

    context: ({ req, res }) => ({ req, res, conn }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log(`Server ready at https://localhost:4000/graphql`);
  });
})().catch(console.error);

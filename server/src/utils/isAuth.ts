import { MiddlewareFn } from 'type-graphql';
import { Context } from '../types';

export const isAuth: MiddlewareFn<Context> = (data, next) => {
  console.log(data);

  if (!data.context.req.session.userId) {
    throw new Error('You are not logged in');
  }
  return next();
};

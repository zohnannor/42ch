import { Arg, ID, Query, Resolver } from 'type-graphql';
import { User } from '../entities/User';

@Resolver()
export class AdminResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await User.find({});
  }

  @Query(() => User, { nullable: true })
  async user(@Arg('id', () => ID) id: number): Promise<User | undefined> {
    return await User.findOne({ id });
  }
}

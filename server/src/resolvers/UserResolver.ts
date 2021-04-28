import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import argon2 from 'argon2';
import { User } from '../entities/User';
import { validateRegister } from '../utils/validateRegister';
import { Context } from '../types';

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ArgsType()
export class UserRegisterInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@Resolver(User)
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hello';
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: Context): Promise<User | undefined> {
    const userId = req.session.userId;
    return User.findOne({ where: { id: userId } });
  }

  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: Context): string {
    if (user.id === req.session.userId) {
      return user.email;
    }
    return '';
  }

  @Mutation(() => UserResponse)
  async register(@Args() options: UserRegisterInput, @Ctx() { req }: Context): Promise<UserResponse> {
    const errors = validateRegister(options);

    if (errors.length > 0) {
      return { errors };
    }

    const userWithEmail = await User.findOne({
      where: { email: options.email },
    });

    if (userWithEmail) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Этот Email уже используется',
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);

    const user = await User.create({
      ...options,
      password: hashedPassword,
    }).save();

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Пользователя с этим Email не существует',
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Неверный пароль',
          },
        ],
      };
    }

    // set cookie
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise(resolve => {
      req.session.destroy(err => {
        if (err) {
          resolve(false);
        }
        res.clearCookie('ul');
        resolve(true);
      });
    });
  }
}

import { UserRegisterInput, FieldError } from '../resolvers/UserResolver';

export const validateRegister = ({ firstName, lastName, email, password }: UserRegisterInput): FieldError[] => {
  const errors = [];

  if (firstName.length < 2) {
    errors.push({
      field: 'firstName',
      message: 'Слишком короткое имя',
    });
  } else if (firstName.match(/[0-9]/)) {
    errors.push({
      field: 'lastName',
      message: 'Недопустимое имя',
    });
  }

  if (lastName.length < 2) {
    errors.push({
      field: 'lastName',
      message: 'Слишком короткая фамилия',
    });
  } else if (lastName.match(/[0-9]/)) {
    errors.push({
      field: 'lastName',
      message: 'Недопустимая фамилия',
    });
  }

  if (password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Минимальная длина пароля - 8 символов',
    });
  } else if (
    !password.match(/\d/) ||
    !password.match(/[a-z]/) ||
    !password.match(/[A-Z]/) ||
    !password.match(/[`~!@#$%^&*()_+-=]/)
  ) {
    errors.push({
      field: 'password',
      message:
        'Пароль должен включать в себя хотя бы одну букву,' + ' одну заглавную букву, цифру и специальный символ',
    });
  }

  if (!email.match(/^\w+@\w+\.\w+$/)) {
    errors.push({
      field: 'email',
      message: 'Неверный Email',
    });
  }

  return errors;
};

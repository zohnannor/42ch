import { FormikErrors } from 'formik';
import { FieldError } from '../generated/graphql';

export const toFormikErrors = <Values>(errors: FieldError[]): FormikErrors<Values> => {
  const map = {};

  errors.forEach(({ field, message }) => {
    map[field] = message;
  });

  return map;
};

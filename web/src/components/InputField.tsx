import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Box,
  InputGroup,
  IconButton,
  InputRightElement,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  showPass?: boolean;
  setShowPass?: React.Dispatch<React.SetStateAction<boolean>>;
};

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder,
  type,
  showPass,
  setShowPass,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField<string>({ name, ...props });

  return (
    <Box mt={4}>
      <FormControl isInvalid={!!error}>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        {type === 'input' ? (
          <Input {...field} {...props} id={name} placeholder={placeholder} isInvalid={!!error} type={type} />
        ) : type === 'password' ? (
          typeof setShowPass !== 'undefined' ? (
            <InputGroup>
              <Input
                {...field}
                {...props}
                id={name}
                placeholder={placeholder}
                isInvalid={!!error}
                type={showPass ? 'text' : 'password'}
              />
              <InputRightElement
                children={
                  <IconButton
                    aria-label='View password'
                    icon={showPass ? <ViewIcon /> : <ViewOffIcon />}
                    onClick={() => setShowPass(v => !v)}
                  />
                }
              />
            </InputGroup>
          ) : (
            <div>Please Provide setShowPass prop</div>
          )
        ) : (
          <Input {...field} {...props} id={name} placeholder={placeholder} isInvalid={!!error} type={type} />
        )}

        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </Box>
  );
};

export default InputField;

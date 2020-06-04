import * as yup from 'yup';

const loginSchemaValidation = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().matches(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"), 'Password must contain 1 number, 1 character, 1 special character ("!@#$...") and at least a minimum length of 8 characters')
});

const registerSchemaValidation = yup.object().shape({
  name: yup.string().min(1).required(),
  username: yup.string()
    .min(5)
    .max(16)
    .required(),
  email: yup.string().email().required(),
  baseCurrency: yup.string().min(3).max(3).required(),
  password: yup.string()
    .matches(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"), 'Password must contain 1 number, 1 character, 1 special character ("!@#$...") and at least a minimum length of 8 characters').required(),
  confirmPassword: yup.ref('password')
});

export { loginSchemaValidation, registerSchemaValidation }

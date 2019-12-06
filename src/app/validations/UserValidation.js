import * as Yup from 'yup';

export const storeSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  password: Yup.string()
    .min(6)
    .required(),
  confirmPassword: Yup.string().when('password', (password, field) =>
    password ? field.required().oneOf([Yup.ref('password')]) : field
  ),
  isAdmin: Yup.bool(),
});

export const updateSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email(),
  isAdmin: Yup.bool(),
});

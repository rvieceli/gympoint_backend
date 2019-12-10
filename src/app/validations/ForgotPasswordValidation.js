import * as Yup from 'yup';

export const storeSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
  endpoint:
    process.env.NODE_ENV === 'development'
      ? Yup.string().required()
      : Yup.string()
          .url()
          .required(),
});

export const updateSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
  password: Yup.string()
    .min(6)
    .required(),
  confirmPassword: Yup.string()
    .when('password', (password, field) =>
      password ? field.required().oneOf([Yup.ref('password')]) : field
    )
    .required(),
});

export default updateSchema;

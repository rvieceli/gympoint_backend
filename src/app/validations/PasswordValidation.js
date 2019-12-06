import * as Yup from 'yup';

export const updateSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(6)
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

import * as Yup from 'yup';

export const storeSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  age: Yup.number()
    .integer()
    .positive()
    .required(),
  weight: Yup.number()
    .positive()
    .required(),
  height: Yup.number()
    .positive()
    .required(),
});

export const updateSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email(),
  age: Yup.number()
    .integer()
    .positive(),
  weight: Yup.number().positive(),
  height: Yup.number().positive(),
});

export default { storeSchema, updateSchema };

import * as Yup from 'yup';

export const storeSchema = Yup.object().shape({
  title: Yup.string().required(),
  duration: Yup.number()
    .integer()
    .positive()
    .required(),
  price: Yup.number()
    .positive()
    .required(),
});

export const updateSchema = Yup.object().shape({
  title: Yup.string(),
  duration: Yup.number().integer(),
  price: Yup.number().positive(),
});

export default { storeSchema, updateSchema };

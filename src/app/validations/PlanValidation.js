import * as Yup from 'yup';

export const storeSchema = Yup.object().shape({
  title: Yup.string().required(),
  duration: Yup.number()
    .integer()
    .required(),
  price: Yup.number()
    .integer()
    .required(),
});

export const updateSchema = Yup.object().shape({
  title: Yup.string(),
  duration: Yup.number().integer(),
  price: Yup.number().integer(),
});

export default { storeSchema, updateSchema };

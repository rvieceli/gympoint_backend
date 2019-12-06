import * as Yup from 'yup';

export const storeSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
  password: Yup.string().required(),
});

export default storeSchema;

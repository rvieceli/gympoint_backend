import * as Yup from 'yup';

export const questionSchema = Yup.object().shape({
  question: Yup.string().required(),
});

export const answerSchema = Yup.object().shape({
  answer: Yup.string().required(),
});

export default { questionSchema, answerSchema };

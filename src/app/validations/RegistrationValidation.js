import * as Yup from 'yup';
import { startOfDay } from 'date-fns';

export const storeSchema = Yup.object().shape({
  plan_id: Yup.number()
    .integer()
    .positive()
    .required(),
  student_id: Yup.number()
    .integer()
    .positive()
    .required(),
  startDate: Yup.date()
    .min(startOfDay(new Date()))
    .required(),
});

export const updateSchema = Yup.object().shape({
  plan_id: Yup.number()
    .integer()
    .positive(),
  startDate: Yup.date().min(startOfDay(new Date())),
});

export default { storeSchema, updateSchema };

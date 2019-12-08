import {
  parseISO,
  addMonths,
  subDays,
  isAfter,
  isBefore,
  startOfDay,
} from 'date-fns';
import { Op } from 'sequelize';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

import {
  storeSchema,
  updateSchema,
} from '../validations/RegistrationValidation';

class RegistrationController {
  async index(request, response) {
    const { page = 1 } = request.query;
    const registrations = await Registration.findAll({
      page,
      offset: (page - 1) * 20,
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration', 'price'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'age', 'weight', 'height'],
        },
      ],
      attributes: { exclude: ['plan_id', 'student_id'] },
    });

    return response.json(registrations);
  }

  async show(request, response) {
    const { id } = request.params;
    const registration = await Registration.findByPk(id, {
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration', 'price'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'age', 'weight', 'height'],
        },
      ],
      attributes: { exclude: ['plan_id', 'student_id'] },
    });

    if (!registration) {
      return response.status(401).json({ error: `Registrations not found` });
    }

    return response.json(registration);
  }

  async store(request, response) {
    const { student_id, plan_id, startDate: startDateText } = request.only([
      'student_id',
      'plan_id',
      'startDate',
    ]);

    try {
      await storeSchema.validate(request.all(), { abortEarly: false });
    } catch (err) {
      return response.status(400).json({
        error: 'Validation failed',
        [err.name]: err.inner,
      });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return response.status(401).json({ error: `Plan not found` });
    }

    const student = await Student.findByPk(student_id);

    if (!student) {
      return response.status(401).json({ error: `Student not found` });
    }

    const startDate = parseISO(startDateText);
    const endDate = subDays(addMonths(startDate, plan.duration), 1);

    const exists = await Registration.findOne({
      where: {
        student_id,
        [Op.or]: [
          { startDate: { [Op.between]: [startDate, endDate] } },
          { endDate: { [Op.between]: [startDate, endDate] } },
        ],
      },
    });

    if (exists) {
      return response.status(401).json({
        error: `There is another plan in the period informed.`,
      });
    }

    const price = plan.price * plan.duration;

    const registration = await Registration.create({
      plan_id,
      student_id,
      startDate,
      endDate,
      price,
    });

    return response.json(registration);
  }

  async update(request, response) {
    const { id } = request.params;

    const registration = await Registration.findByPk(id);

    if (!registration) {
      return response.status(401).json({ error: `Registrations not found` });
    }

    const { plan_id, startDate: startDateText } = request.only([
      'plan_id',
      'startDate',
    ]);

    if (!plan_id && !startDateText) {
      return response.status(400).json({ error: 'Nothing to update' });
    }

    try {
      await updateSchema.validate(request.all(), { abortEarly: false });
    } catch (err) {
      return response.status(400).json({
        error: 'Validation failed',
        [err.name]: err.inner,
      });
    }

    if (
      startDateText &&
      isAfter(startOfDay(new Date()), parseISO(registration.startDate))
    ) {
      return response
        .status(401)
        .json({ error: `You can't update start date after started` });
    }

    const startDate = parseISO(startDateText || registration.startDate);

    const plan = await Plan.findByPk(plan_id || registration.plan_id);

    if (!plan) {
      return response.status(401).json({ error: `Plan not found` });
    }

    const endDate = subDays(addMonths(startDate, plan.duration), 1);

    if (isAfter(new Date(), endDate)) {
      return response.status(401).json({
        error: `You can't update to this shorter plan because the new end date has passed.`,
      });
    }

    const exists = await Registration.findOne({
      where: {
        student_id: registration.student_id,
        id: { [Op.ne]: registration.id },
        [Op.or]: [
          { startDate: { [Op.between]: [startDate, endDate] } },
          { endDate: { [Op.between]: [startDate, endDate] } },
        ],
      },
    });

    if (exists) {
      return response.status(401).json({
        error: `There is another plan in the period informed.`,
      });
    }

    const price = plan.price * plan.duration;

    await registration.update({
      plan_id: plan.id,
      startDate,
      endDate,
      price,
    });

    return response.send(registration);
  }

  async delete(request, response) {
    const { id } = request.params;
    const registration = await Registration.findByPk(id);

    if (!registration) {
      return response.status(401).json({ error: `Registrations not found` });
    }

    if (isAfter(startOfDay(new Date()), parseISO(registration.startDate))) {
      return response
        .status(401)
        .json({ error: `You can't delete after the registration is started` });
    }

    await registration.destroy();

    return response.send();
  }
}

export default new RegistrationController();

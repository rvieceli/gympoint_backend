import { parseISO, addMonths, subDays, isAfter, startOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

import RegistrationMail from '../jobs/RegistrationMail';
import RegistrationUpdateMail from '../jobs/RegistrationUpdateMail';
import RegistrationCancelMail from '../jobs/RegistrationCancelMail';
import Queue from '../../lib/Queue';

import {
  storeSchema,
  updateSchema,
} from '../validations/RegistrationValidation';

class RegistrationController {
  async index(request, response) {
    const { page = 1, pageSize = 10 } = request.query;
    const { count, rows } = await Registration.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
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

    return response.json({
      page: +page,
      pageSize: +pageSize,
      pages: Math.ceil(count / pageSize),
      rows,
    });
  }

  async show(request, response) {
    const { id } = request.params;
    const registration = await Registration.findByPk(id, {
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'age', 'weight', 'height'],
        },
      ],
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

    Queue.add(RegistrationMail.key, {
      registration,
      student,
      plan,
    });

    return response.json(registration);
  }

  async update(request, response) {
    const { id } = request.params;

    const registration = await Registration.findByPk(id, {
      include: [
        {
          model: Plan,
          as: 'plan',
        },
        {
          model: Student,
          as: 'student',
        },
      ],
    });

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

    const { student } = registration;

    await registration.update({
      plan_id: plan.id,
      startDate,
      endDate,
      price,
    });

    Queue.add(RegistrationUpdateMail.key, {
      student,
      plan,
      registration,
    });

    return response.send(registration);
  }

  async delete(request, response) {
    const { id } = request.params;
    const registration = await Registration.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
    });

    if (!registration) {
      return response.status(401).json({ error: `Registrations not found` });
    }

    if (isAfter(startOfDay(new Date()), parseISO(registration.startDate))) {
      return response
        .status(401)
        .json({ error: `You can't delete after the registration is started` });
    }

    const { student } = registration;

    await registration.destroy();

    Queue.add(RegistrationCancelMail.key, {
      student,
    });

    return response.send();
  }
}

export default new RegistrationController();

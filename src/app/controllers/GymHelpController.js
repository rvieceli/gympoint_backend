import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

import { answerSchema } from '../validations/HelpOrderValidation';

import Queue from '../../lib/Queue';
import HelpOrderAnswerMail from '../jobs/HelpOrderAnswerMail';

class GymHelpController {
  async index(request, response) {
    const { page = 1, pageSize = 10 } = request.query;

    const { count, rows } = await HelpOrder.findAndCountAll({
      where: {
        answer: null,
      },
      page,
      offset: (page - 1) * pageSize,
      attributes: { exclude: ['student_id', 'answer', 'answerAt'] },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'age', 'height', 'weight'],
        },
      ],
    });

    return response.json({
      page: +page,
      pageSize: +pageSize,
      pages: Math.ceil(count / pageSize),
      rows,
    });
  }

  async store(request, response) {
    const { answer } = request.only(['answer']);

    try {
      await answerSchema.validate({ answer }, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({
        error: 'Validation failed',
        [err.name]: err.inner,
      });
    }

    const { id } = request.params;

    const helpOrder = await HelpOrder.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!helpOrder) {
      return response.status(401).json({ error: 'Help order not found' });
    }

    await helpOrder.update({
      answer,
      answerAt: new Date(),
    });

    await Queue.add(HelpOrderAnswerMail.key, {
      helpOrder,
    });

    return response.json(helpOrder);
  }
}

export default new GymHelpController();

import { subDays } from 'date-fns';
import { Op } from 'sequelize';

import Student from '../models/Student';
import CheckIn from '../models/CheckIn';
import Registration from '../models/Registration';

class StudentCheckInController {
  async index(request, response) {
    const { id } = request.params;
    const { page = 1, pageSize = 10 } = request.query;

    const { count, rows } = await CheckIn.findAndCountAll({
      where: {
        student_id: id,
      },
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['created_at', 'DESC']],
    });

    return response.json({
      page: +page,
      pageSize: +pageSize,
      pages: Math.ceil(count / pageSize),
      rows,
    });
  }

  async store(request, response) {
    const { id } = request.params;

    const student = await Student.findByPk(id, {
      include: [
        {
          model: CheckIn,
          as: 'checkIns',
          where: {
            created_at: { [Op.gte]: subDays(new Date(), 6) },
          },
          required: false,
        },
        {
          model: Registration,
          as: 'registrations',
          where: {
            startDate: { [Op.lte]: new Date() },
            endDate: { [Op.gte]: new Date() },
          },
          required: false,
        },
      ],
    });

    if (!student) {
      return response.status(401).json({ error: 'Student not found' });
    }

    if (student.registrations.length === 0) {
      return response
        .status(401)
        .json({ error: 'Student dont have a valid registration', student });
    }

    if (student.checkIns.length >= 5) {
      return response
        .status(401)
        .json({ error: 'You can make only five check-ins in seven days.' });
    }

    const checkIn = await CheckIn.create({
      student_id: student.id,
      registration_id: student.registrations[0].id,
    });

    return response.json({ checkIn });
  }
}

export default new StudentCheckInController();

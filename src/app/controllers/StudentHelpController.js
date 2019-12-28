import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

import { questionSchema } from '../validations/HelpOrderValidation';

class StudentHelpController {
  async index(request, response) {
    const { id } = request.params;
    const { page = 1, pageSize = 10 } = request.query;

    const { count, rows } = await HelpOrder.findAndCountAll({
      where: {
        student_id: id,
      },
      limit: pageSize,
      offset: (page - 1) * pageSize,
      attributes: { exclude: ['student_id'] },
      order: [['updated_at', 'DESC']],
    });

    return response.json({
      page: +page,
      pageSize: +pageSize,
      pages: Math.ceil(count / pageSize),
      rows,
    });
  }

  async store(request, response) {
    const { question } = request.only(['question']);

    try {
      await questionSchema.validate({ question }, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({
        error: 'Validation failed',
        [err.name]: err.inner,
      });
    }

    const { id } = request.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return response.status(401).json({ error: 'Student not found' });
    }

    const helpOrder = await HelpOrder.create({
      student_id: id,
      question,
    });

    return response.json(helpOrder);
  }
}

export default new StudentHelpController();

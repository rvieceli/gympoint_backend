import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

import { questionSchema } from '../validations/HelpOrderValidation';

class StudentHelpController {
  async index(request, response) {
    const { id } = request.params;
    const { page = 1, pageSize = 20 } = request.query;

    const helpOrders = await HelpOrder.findAll({
      where: {
        student_id: id,
      },
      page,
      offset: (page - 1) * pageSize,
      attributes: { exclude: ['student_id'] },
    });

    return response.json(helpOrders);
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

    const student = Student.findByPk(id);

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

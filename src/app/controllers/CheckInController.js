import Student from '../models/Student';
import CheckIn from '../models/CheckIn';

class CheckInController {
  async index(request, response) {
    const { page = 1, pageSize = 10 } = request.query;

    const { count, rows } = await CheckIn.findAndCountAll({
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
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
}

export default new CheckInController();

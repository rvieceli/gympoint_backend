import { Op } from 'sequelize';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Registration from '../models/Registration';
import HelpOrder from '../models/HelpOrder';

class StatisticController {
  async index(request, response) {
    const students = await Student.count();
    const plans = await Plan.count();
    const registrations = await Registration.count({
      where: {
        startDate: { [Op.lte]: new Date() },
        endDate: { [Op.gte]: new Date() },
      },
    });

    const questions = await HelpOrder.count({ where: { answer: null } });

    return response.json({
      students,
      plans,
      registrations,
      questions,
    });
  }
}

export default new StatisticController();

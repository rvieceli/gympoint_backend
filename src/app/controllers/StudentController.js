import Sequelize, { Op } from 'sequelize';
import Student from '../models/Student';

import { storeSchema, updateSchema } from '../validations/StudentValidation';

class StudentController {
  async index(request, response) {
    const { page = 1, pageSize = 10, q } = request.query;

    const where = q
      ? Sequelize.where(
          Sequelize.fn('f_unaccent', Sequelize.col('name')),
          Op.iLike,
          Sequelize.fn('f_unaccent', `%${q}%`)
        )
      : null;

    const { rows, count } = await Student.findAndCountAll({
      where,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['name', 'ASC']],
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

    const student = await Student.findByPk(id);

    if (!student) {
      return response.status(404).json({ error: 'Student not found' });
    }

    return response.json(student);
  }

  async store(request, response) {
    const { email } = request.all();

    try {
      await storeSchema.validate(request.all(), { abortEarly: false });
    } catch (err) {
      return response.status(400).json({
        error: 'Validation failed',
        [err.name]: err.inner,
      });
    }

    const exists = await Student.findOne({ where: { email } });

    if (exists) {
      return response.status(400).json({ error: 'Student already exists' });
    }

    const student = await Student.create(request.all());

    return response.json(student);
  }

  async update(request, response) {
    const { id } = request.params;
    const { email } = request.all();

    try {
      await updateSchema.validate(request.all(), { abortEarly: false });
    } catch (err) {
      return response.status(400).json({
        error: 'Validation failed',
        [err.name]: err.inner,
      });
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return response.status(404).json({ error: 'Student not found' });
    }

    if (email && email !== student.email) {
      const exists = await Student.findOne({ where: { email } });

      if (exists) {
        return response.status(400).json({ error: 'User already exists' });
      }
    }

    await student.update(request.all());

    return response.json(student);
  }

  async delete(request, response) {
    const { id } = request.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return response.status(404).json({ error: 'Student not found' });
    }

    await student.destroy();

    return response.send();
  }
}

export default new StudentController();

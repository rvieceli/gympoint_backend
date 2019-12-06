import Student from '../models/Student';

class StudentController {
  async index(request, response) {
    const { page = 1 } = request.query;

    const students = await Student.findAll({
      limit: 20,
      offset: (page - 1) * 20,
    });

    return response.json(students);
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

    const student = await Student.findByPk(id);

    if (!student) {
      return response.status(404).json({ error: 'Student not found' });
    }

    if (email && email !== student.email) {
      const exists = await student.findOne({ where: { email } });

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

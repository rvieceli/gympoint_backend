import Student from '../models/Student';

import { censorEmail } from '../../utils/format';

import Queue from '../../lib/Queue';
import StudentAccessTokenMail from '../jobs/StudentAccessTokenMail';

class StudentLoginController {
  async show(request, response) {
    const { id, token } = request.params;

    if (!Number.isInteger(Number(id))) {
      return response.status(401).json({ error: 'ID is not valid' });
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return response.status(404).json({ error: 'Student not found' });
    }

    if (student.accessToken !== token) {
      return response.status(404).json({ error: 'Access token is not valid.' });
    }

    return response.json(student);
  }

  async store(request, response) {
    const { id } = request.params;

    if (!Number.isInteger(Number(id))) {
      return response.status(401).json({ error: 'ID is not valid' });
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return response.status(404).json({ error: 'Student not found' });
    }

    student.update({
      accessToken: `${Math.floor(Math.random() * 9000) + 1000}`,
    });

    Queue.add(StudentAccessTokenMail.key, {
      student,
    });

    const { name, email } = student;

    return response.json({ name, email: censorEmail(email) });
  }
}

export default new StudentLoginController();

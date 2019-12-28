import Mail from '../../lib/Mail';

import { formatDate } from '../../utils/format';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { student, plan, registration } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Sua matrícula foi feita com sucesso!',
      template: 'registration',
      context: {
        studentId: student.id,
        studentName: student.name,
        planTitle: plan.title,
        registrationPrice: registration.price,
        registrationStartDate: formatDate(registration.startDate),
        registrationEndDate: formatDate(registration.endDate),
      },
    });
  }
}

export default new RegistrationMail();

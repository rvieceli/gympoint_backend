import Mail from '../../lib/Mail';

import { formatDate } from '../../utils/format';

class RegistrationUpdateMail {
  get key() {
    return 'RegistrationUpdateMail';
  }

  async handle({ data }) {
    const { student, plan, registration } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Sua matrícula foi alterada com sucesso!',
      template: 'registration_update',
      context: {
        studentName: student.name,
        planTitle: plan.title,
        registrationPrice: registration.price,
        registrationStartDate: formatDate(registration.startDate),
        registrationEndDate: formatDate(registration.endDate),
      },
    });
  }
}

export default new RegistrationUpdateMail();

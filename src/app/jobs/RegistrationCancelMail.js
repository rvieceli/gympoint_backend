import Mail from '../../lib/Mail';

class RegistrationCancelMail {
  get key() {
    return 'RegistrationCancelMail';
  }

  async handle({ data }) {
    const { student } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Sua matrícula foi cancelada com sucesso!',
      template: 'registration_cancel',
      context: {
        studentName: student.name,
      },
    });
  }
}

export default new RegistrationCancelMail();

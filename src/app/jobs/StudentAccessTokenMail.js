import Mail from '../../lib/Mail';

class StudentAccessTokenMail {
  get key() {
    return 'StudentAccessTokenMail';
  }

  async handle({ data }) {
    const { student } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Token para acesso no App!',
      template: 'access_token',
      context: {
        student,
      },
    });
  }
}

export default new StudentAccessTokenMail();

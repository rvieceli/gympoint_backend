import Mail from '../../lib/Mail';

class HelpOrderAnswerMail {
  get key() {
    return 'HelpOrderAnswerMail';
  }

  async handle({ data }) {
    const {
      helpOrder,
      helpOrder: { student },
    } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Temos uma resposta para sua pergunta',
      template: 'helporder_answer',
      context: {
        studentName: student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}

export default new HelpOrderAnswerMail();

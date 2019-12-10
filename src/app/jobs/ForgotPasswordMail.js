import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class ForgotPasswordMail {
  get key() {
    return 'ForgotPasswordMail';
  }

  async handle({ data }) {
    const { user, link } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Altere a sua senha!',
      template: 'forgot_password',
      context: {
        userName: user.name,
        expiresIn: format(
          parseISO(user.resetPasswordExpires),
          "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
          { locale: pt }
        ),
        link,
      },
    });
  }
}

export default new ForgotPasswordMail();

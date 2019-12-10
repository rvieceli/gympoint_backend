import { addHours, isBefore } from 'date-fns';
import uuidv4 from 'uuid/v4';

import User from '../models/User';

import {
  storeSchema,
  updateSchema,
} from '../validations/ForgotPasswordValidation';

import Queue from '../../lib/Queue';
import ForgotPasswordMail from '../jobs/ForgotPasswordMail';

class ForgotPasswordController {
  async store(request, response) {
    const { email, endpoint } = request.all();

    try {
      await storeSchema.validate({ email, endpoint }, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({
        error: 'Validation failed',
        [err.name]: err.inner,
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return response
        .status(401)
        .json({ error: 'User not found with this mail' });
    }

    await user.update({
      resetPasswordToken: uuidv4(),
      resetPasswordExpires: addHours(new Date(), 1),
    });

    Queue.add(ForgotPasswordMail.key, {
      user,
      link: endpoint.replace('%token%', user.resetPasswordToken),
    });

    return response.json({
      message: `An email was sended to ${email} and is valid for one hour.`,
    });
  }

  async update(request, response) {
    const { token: resetPasswordToken } = request.params;
    const { email, password } = request.all();

    try {
      await updateSchema.validate(request.all(), { abortEarly: false });
    } catch (err) {
      return response.status(400).json({
        error: 'Validation failed',
        [err.name]: err.inner,
      });
    }

    const user = await User.findOne({ where: { email, resetPasswordToken } });

    if (!user) {
      return response
        .status(401)
        .json({ error: 'Email or token is not valid' });
    }

    if (isBefore(user.resetPasswordExpires, new Date())) {
      return response.status(401).json({ error: 'Token was expired' });
    }

    await user.update({
      password,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return response.send();
  }
}

export default new ForgotPasswordController();

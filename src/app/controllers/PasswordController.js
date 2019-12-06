import User from '../models/User';

import { updateSchema } from '../validations/PasswordValidation';

class PasswordController {
  async update(request, response) {
    const { userId } = request;
    const { oldPassword, password } = request.only(['oldPassword', 'password']);

    if (!(await updateSchema.isValid(request.all()))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const user = await User.findByPk(userId);

    if (!(await user.checkPassword(oldPassword))) {
      return response.status(401).json({ error: 'Password does not match' });
    }

    await user.update({ password });

    return response.json(user.showable());
  }
}

export default new PasswordController();

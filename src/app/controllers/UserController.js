import User from '../models/User';

import { storeSchema, updateSchema } from '../validations/UserValidation';

class UserController {
  async store(request, response) {
    const data = request.only(['name', 'email', 'password']);

    try {
      await storeSchema.validate(request.all(), { abortEarly: false });
    } catch (err) {
      return response.status(400).json({
        error: 'Validation failed',
        [err.name]: err.inner,
      });
    }

    const { email } = data;

    const exists = await User.findOne({ where: { email } });

    if (exists) {
      return response.status(400).json({ error: 'User already exists' });
    }

    const { id, name } = await User.create(data);

    return response.json({ id, name, email });
  }

  async update(request, response) {
    const { userId } = request;
    const data = request.only(['email', 'name']);

    try {
      await updateSchema.validate(data, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({
        error: 'Validation failed',
        [err.name]: err.inner,
      });
    }

    const { email } = data;

    const user = await User.findByPk(userId);

    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });

      if (exists) {
        return response.status(400).json({ error: 'User already exists' });
      }
    }

    await user.update(data);

    return response.json(user.showable());
  }
}

export default new UserController();

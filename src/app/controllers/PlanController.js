import Plan from '../models/Plan';

import { storeSchema, updateSchema } from '../validations/PlanValidation';

class PlanController {
  async index(request, response) {
    const { page = 1, pageSize = 10 } = request.query;

    const { rows, count } = await Plan.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      attributes: ['id', 'title', 'duration', 'price'],
      order: [['duration', 'ASC']],
    });

    return response.json({
      page: +page,
      pageSize: +pageSize,
      pages: Math.ceil(count / pageSize),
      rows,
    });
  }

  async show(request, response) {
    const { id } = request.params;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return response.status(404).json({ error: 'Plan not found' });
    }

    return response.json(plan.showable());
  }

  async store(request, response) {
    const data = request.only(['title', 'duration', 'price']);

    try {
      await storeSchema.validate(data, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({
        error: 'Validation failed',
        [err.name]: err.inner,
      });
    }

    const plan = await Plan.create(data);

    return response.json(plan.showable());
  }

  async update(request, response) {
    const data = request.only(['title', 'duration', 'price']);

    try {
      await updateSchema.validate(data, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({
        error: 'Validation failed',
        [err.name]: err.inner,
      });
    }

    const { id } = request.params;
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return response.status(404).json({ error: 'Plan not found' });
    }

    await plan.update(data);

    return response.json(plan.showable());
  }

  async delete(request, response) {
    const { id } = request.params;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return response.status(404).json({ error: 'Plan not found' });
    }

    await plan.destroy();

    return response.send();
  }
}

export default new PlanController();

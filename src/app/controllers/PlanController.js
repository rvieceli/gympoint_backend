import Plan from '../models/Plan';

import { storeSchema, updateSchema } from '../validations/PlanValidation';

class PlanController {
  async index(request, response) {
    const { page = 1 } = request.query;

    const plans = await Plan.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['title', 'duration', 'price'],
    });

    return response.json(plans);
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

    if (!(await storeSchema.isValid(data))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const plan = await Plan.create(data);

    return response.json(plan.showable());
  }

  async update(request, response) {
    const data = request.only(['title', 'duration', 'price']);

    if (!(await updateSchema.isValid(data))) {
      return response.status(400).json({ error: 'Validation fails' });
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

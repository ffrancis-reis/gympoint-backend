import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation failed' });
    }

    const planExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (planExists) {
      return res.status(400).json({ error: 'plan already exists' });
    }

    const { name, title, duration, price } = await Plan.create(req.body);

    return res.json({
      user: {
        name,
        title,
        duration,
        price,
      },
    });
  }

  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['title', 'duration', 'price'],
    });

    return res.json(plans);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number()
        .integer()
        .positive(),
      price: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation failed' });
    }

    const plan = await Plan.findOne({
      where: { id: req.params.id },
    });

    if (!plan) {
      return res.status(400).json({ error: 'plan not found' });
    }

    const { title, duration, price } = await plan.update(req.body);

    return res.json({
      user: {
        title,
        duration,
        price,
      },
    });
  }

  async delete(req, res) {
    const plan = await Plan.findOne({
      where: { id: req.params.id },
    });

    if (!plan) {
      return res.status(400).json({ error: 'plan not found' });
    }

    plan.destroy();

    return res.status(200).json({ success: 'plan excluded' });
  }
}

export default new PlanController();

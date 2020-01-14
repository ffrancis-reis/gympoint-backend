import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation failed' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'student already exists' });
    }

    const { name, email, age, weight, height } = await Student.create(req.body);

    return res.json({
      user: {
        name,
        email,
        age,
        weight,
        height,
      },
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number().min(18),
      weight: Yup.number().positive(),
      height: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation failed' });
    }

    const student = await Student.findOne({
      where: { id: req.params.id },
    });

    if (!student) {
      return res.status(400).json({ error: 'student not found' });
    }

    const { name, email, age, weight, height } = await student.update(req.body);

    return res.json({
      user: {
        name,
        email,
        age,
        weight,
        height,
      },
    });
  }
}

export default new StudentController();

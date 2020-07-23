/* eslint-disable camelcase */
import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import CreateAppointmentService from '../services/CreateAppointmentService';
import AppointmentRepository from '../repositories/AppointmentsRepository';

import ensureAuthenticaded from '../middlewares/ensureAuthenticaded';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticaded);

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentRepository);

  const appointments = await appointmentsRepository.find();
  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider_id, date } = request.body;

    const createAppointment = new CreateAppointmentService();
    const appointment = await createAppointment.execute({
      date: parseISO(date),
      provider_id,
    });

    return response.json(appointment);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default appointmentsRouter;

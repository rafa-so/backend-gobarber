/* eslint-disable camelcase */
import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const AppointmentDate = startOfHour(date);
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const fildAppointmentInSameDate = await appointmentsRepository.findByDate(
      AppointmentDate,
    );

    if (fildAppointmentInSameDate) {
      throw Error('This appointment is already booked');
    }

    const appointment = appointmentsRepository.create({
      date: AppointmentDate,
      provider_id,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;

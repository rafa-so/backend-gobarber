import { startOfHour } from 'date-fns';
import Appointment from '../models/appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository: AppointmentsRepository;

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ date, provider }: Request): Appointment {
    const AppointmentDate = startOfHour(date);

    const fildAppointmentInSameDate = this.appointmentsRepository.findByDate(
      AppointmentDate,
    );

    if (fildAppointmentInSameDate) {
      throw Error('This appointment is already booked');
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: AppointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;

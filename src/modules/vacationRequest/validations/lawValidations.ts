import dayjs = require('dayjs');
import { HolidaysRelax } from '../calendar/holidays';
import { VacationRequestDto } from '../dto/vacation-request.dto';
import { ValidationHandler } from './request.interface';

/**
 *    As regras das férias CLT, ajustadas em 2017, não permitem que agende dois dias antes de um feriado ou de seu descanso semanal remunerado, ou seja, no domingo
 */
export class LawValidations extends ValidationHandler {
  public async handle(
    request: VacationRequestDto,
    id: string,
    errors: Array<string>,
  ): Promise<boolean> {
    const twoDaysAfterStartDate = dayjs(request.startDate).add(2, 'day');
    const oneDayAfterStartDate = dayjs(request.startDate).add(1, 'day');
    const currentYear = new Date().getFullYear();

    const x = new HolidaysRelax(currentYear);
    console.log(x.isHoliday(request.startDate));

    console.log(twoDaysAfterStartDate.day());

    if (twoDaysAfterStartDate.day() == 0 || oneDayAfterStartDate.day() == 0) {
      errors.push(
        'Erro! Não é possível iniciar as férias dois dias antes de domingo',
      );
    }

    if (
      x.isHoliday(twoDaysAfterStartDate.toDate()) ||
      x.isHoliday(oneDayAfterStartDate.toDate())
    ) {
      errors.push(
        'Erro! Não é possível iniciar as férias em dois dias antes de feriado',
      );
    }

    if (errors.length == 0) {
      return super.handle(request, id, errors);
    } else {
      return false;
    }
  }
}

import * as moment from 'moment';

import { ValidationHandler } from './request.interface';

import { VacationRequestDto } from '../dto/vacation-request.dto';
import { VacationRequestService } from '../vacation-request.service';
import { PeriodService } from 'src/modules/period/period.service';

/* Represent:
    - As férias podem ser divididas em até três períodos de 10 dias. Não é permitido período inferior a 10 dias."
*/
export class BasicValidations extends ValidationHandler {
  constructor(
    private readonly requestRepo: VacationRequestService,
    private readonly periodRepo: PeriodService,
  ) {
    super();
  }

  public async handle(
    request: VacationRequestDto,
    id: string,
    errors: Array<string>,
  ): Promise<boolean> {
    const success = await this.performDaysValidation(request, id, errors);

    console.log(errors);
    if (!success) {
      return false;
    }

    return super.handle(request, id, errors);
  }

  private async performDaysValidation(
    request: VacationRequestDto,
    id: string,
    errors: Array<string>,
  ): Promise<boolean> {
    const requestStartDate = moment(request.startDate);
    const requestFinalDate = moment(request.finalDate);

    const diffInDays: number = requestFinalDate.diff(requestStartDate, 'd');

    if (
      diffInDays != 10 &&
      diffInDays != 15 &&
      diffInDays != 20 &&
      diffInDays != 30
    ) {
      errors.push('Erro! Você só pode usufruir de 10, 15, 20 ou 30 dias!');
    }

    if (diffInDays > 30) {
      errors.push('Erro! Você deve solicitar no máximo 30 dias');
    }

    if (diffInDays < 10) {
      errors.push('Erro! Você deve solicitar pelo menos 10 dias de férias!');
    }

    const daysEnjoyed = 30;

    const daysAllowed = 10;

    if (daysEnjoyed + diffInDays > daysAllowed) {
      errors.push(
        `Erro! Você não pode solicitar mais de ${daysAllowed} dias de férias!`,
      );
    }

    return errors.length == 0;
  }

  private async getDaysEnjoyed(
    vacationTime: string,
    id: string,
  ): Promise<number> {
    return 30;
  }
}

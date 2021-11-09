import dayjs = require('dayjs');
import { Op } from 'sequelize';

import { Period } from 'src/modules/period/period.entity';

import { VacationRequest } from '../vacation-request.entity';

import { ValidationHandler } from './request.interface';

import { VacationRequestDto } from '../dto/vacation-request.dto';
import { PeriodService } from 'src/modules/period/period.service';
import { RequestService } from '../vacation-request.service';

/* Represent:
    - As férias podem ser divididas em até três períodos de 10 dias. Não é permitido período inferior a 10 dias."
*/

export class BasicValidations extends ValidationHandler {
  constructor(
    private readonly requestRepo: RequestService,
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
    const requestStartDate: dayjs.Dayjs = dayjs(request.startDate);
    const requestFinalDate: dayjs.Dayjs = dayjs(request.finalDate);

    const diffMiliSec: number = requestFinalDate.diff(requestStartDate);
    const diffInDays: number = diffMiliSec / (1000 * 60 * 60 * 24) + 1;

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

    const daysEnjoyed = await this.getDaysEnjoyed(request.periodId, id);
    const vacationTime = await this.periodRepo.findOneOrFail(id);
    //   await this.period.findOne<VacationTime>({
    //     where: { id: request.vacationTimeId },
    //   });
    const daysAllowed = vacationTime.getDaysAllowed();

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
    const requests = await this.vacationRequestRepository.findAll({
      where: {
        vacationTimeId: vacationTime,
        id: {
          [Op.ne]: id,
        },
      },
    });

    const daysMilisec = requests.reduce((acc, vacation) => {
      return dayjs(vacation.finalDate).diff(dayjs(vacation.startDate)) + acc;
    }, 0);

    return daysMilisec != 0 ? daysMilisec / (1000 * 60 * 60 * 24) + 1 : 0;
  }
}

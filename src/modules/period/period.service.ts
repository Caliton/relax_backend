import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period } from './period.entity';

import { MAX_DAYS_PER_PERIOD, PARAM_LIMIT_DATE } from 'src/core/enumerators';

@Injectable()
export class PeriodService {
  // public async getVacationTimeByPerson(collaboratorId: string) {
  //   const vacationTimes = await this.periodRepo.find({
  //     relations: ['request'],
  //     where: {
  //       collaborator: { id: collaboratorId },
  //     },
  //   });

  //   return vacationTimes.map((vacation) =>
  //     this.toResponseObject(vacation, PARAM_LIMIT_DATE),
  //   );
  // }

  // private toResponseObject(period: Period, monthsLimitBySettings: number) {
  //   const companyLimitMonths = new Date(period.limitDate);
  //   companyLimitMonths.setDate(
  //     companyLimitMonths.getDate() - monthsLimitBySettings * 30,
  //   );

  //   const responseObject: any = {
  //     id: period.id,
  //     vacationDate: period.vacationDate,
  //     daysAllowed: period.getDaysAllowed(),
  //     limitDate: period.limitDate,
  //     limit6Months: companyLimitMonths,
  //   };

  //   if (period.requests.length) {
  //     responseObject.daysEnjoyed = period.requests
  //       .filter((request) => request.status.description !== 'recusado')
  //       .reduce(
  //         (previousValue, current) =>
  //           previousValue +
  //           this.calcDiffInDays(current.finalDate, current.startDate),
  //         0,
  //       );

  //     responseObject.daysBalance =
  //       responseObject.daysAllowed - responseObject.daysEnjoyed;
  //   } else {
  //     responseObject.daysEnjoyed = 0;
  //     responseObject.daysBalance = MAX_DAYS_PER_PERIOD;
  //   }

  //   return responseObject;
  // }

  private calcDiffInDays(endDate: string, startDate: string): number {
    const diff = Math.abs(
      new Date(endDate).getTime() - new Date(startDate).getTime(),
    );
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return diffDays > 0 ? diffDays + 1 : 0;
  }
}

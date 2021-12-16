import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { request } from 'http';
import * as moment from 'moment';
import { MAX_DAYS_PER_PERIOD } from 'src/core/enumerators';
import { Repository } from 'typeorm';
import { RequestStatusDto } from './dto/request-status.dto';
import { RequestStatus, VacationRequest } from './vacation-request.entity';

@Injectable()
export class VacationRequestService {
  constructor(
    @InjectRepository(VacationRequest)
    private readonly vacationRequestRepo: Repository<VacationRequest>,
  ) {}

  async findAll() {
    const requests = await this.vacationRequestRepo.find({
      relations: ['requestUser'],
    });

    return requests.map((e) => ({
      ...e,
      ...this.makePeriodDaysAllowed(requests, {
        start: e.startPeriod,
        end: moment(e.startPeriod)
          .year(moment(e.startPeriod).year() + 1)
          .format('YYYY-MM-DD'),
      }),
    }));
  }

  async alterStatus(requestStatus: RequestStatusDto) {
    try {
      const request = await this.vacationRequestRepo.findOneOrFail(
        requestStatus.id,
      );

      request.status = requestStatus.status;

      return await this.vacationRequestRepo.save(request);
    } catch (e) {}
  }

  async findOneOrFail(id: string) {
    try {
      return await this.vacationRequestRepo.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  private makePeriodDaysAllowed(
    requests: Array<VacationRequest>,
    period: { start: string; end: string },
  ) {
    let daysAllowed = MAX_DAYS_PER_PERIOD;

    const isOldPeriod =
      parseInt(moment(period.end).format('YYYYMMDD')) <
      parseInt(moment().format('YYYYMMDD'));

    const isNewPeriod =
      parseInt(moment(period.start).format('YYYYMMDD')) >
      parseInt(moment().format('YYYYMMDD'));

    const calculedDaysAllowed = Math.trunc(
      moment().diff(period.start, 'M') * 2.5,
    );

    daysAllowed = isOldPeriod ? MAX_DAYS_PER_PERIOD : calculedDaysAllowed;

    if (isNewPeriod) daysAllowed = 0;

    let daysBalance = 0;
    let daysScheduled = 0;
    let daysEnjoyed = 0;

    let letReserve = 0;

    if (requests.length) {
      // const requestAgroupYear = this.handleRequest(requests);

      const requestScheduled = requests.filter(
        (request) =>
          request.startPeriod === period.start &&
          request.status === RequestStatus.APPROVED,
      );

      const requestEnjoyed = requests.filter(
        (request) =>
          request.startPeriod === period.start &&
          request.status === RequestStatus.APPROVED &&
          parseInt(moment(request.finalDate).format('YYYYMMDD')) <
            parseInt(moment().format('YYYYMMDD')),
      );

      if (!requestEnjoyed.length) {
        daysEnjoyed = 0;
      } else {
        daysEnjoyed = requestEnjoyed
          .map((item) => moment(item.finalDate).diff(item.startDate, 'day') + 1)
          .reduce((a, b) => a + b);
      }

      letReserve = this.countDay(requestScheduled);
    }

    daysScheduled = letReserve - daysEnjoyed;
    daysBalance = daysAllowed - letReserve;

    return {
      daysAllowed,
      daysEnjoyed,
      daysScheduled,
      daysBalance,
    };
  }

  private countDay(list: any) {
    if (!list || !list.length) return 0;
    return list
      .map(
        (item: any) => moment(item.finalDate).diff(item.startDate, 'day') + 1,
      )
      .reduce((a: any, b: any) => a + b);
  }

  async create(data: VacationRequest) {
    return await this.vacationRequestRepo.save(
      this.vacationRequestRepo.create(data),
    );
  }

  async update(id: string, data: VacationRequest) {
    const profile = await this.findOneOrFail(id);

    this.vacationRequestRepo.merge(profile, data);
    return await this.vacationRequestRepo.save(profile);
  }

  async deleteById(id: string) {
    await this.vacationRequestRepo.delete(id);
  }
}

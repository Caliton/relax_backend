import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { MAX_DAYS_PER_PERIOD } from 'src/core/enumerators';
import { handleErrors } from 'src/shared/utils/errors-helper';
import { CollaboratorType } from '../collaborator/collaborator.entity';
import { CollaboratorService } from '../collaborator/collaborator.service';
import { PeriodStatusService } from '../periodStatus/period-status.service';
import {
  RequestStatus,
  VacationRequest,
} from '../vacationRequest/vacation-request.entity';

@Injectable()
export class PeriodService {
  constructor(
    private readonly periodStatusService: PeriodStatusService,
    private readonly collaboratorService: CollaboratorService,
  ) {}

  public async getPeriod(id: string, year: number) {
    if (!id) throw handleErrors(id, 'id do colaborador não informado');

    const collaborator = await this.collaboratorService.findOneOrFail(id);

    const { requests, hiringdate, type } = collaborator;

    const { start, end } = this.makePeriodRange({ requests, hiringdate, year });

    const { limitEnterprise, ultimate } = this.makePeriodLimits({
      requests,
      hiringdate,
      year,
    });

    const { daysAllowed, daysEnjoyed, daysBalance, daysScheduled } =
      this.makePeriodDaysAllowed(requests, { start, end });

    const situation = await this.makePeriodStatus(
      limitEnterprise,
      daysEnjoyed,
      type,
    );

    const period = {
      start,
      end,
      limitEnterprise,
      ultimate,
      daysAllowed,
      daysEnjoyed,
      daysScheduled,
      daysBalance,
      requests: requests
        .filter((a) => a.startPeriod === start)
        .sort(
          (a, b) =>
            parseInt(moment(b.startDate).format('YYYYMMDD')) -
            parseInt(moment(a.startDate).format('YYYYMMDD')),
        ),
      situation,
    };

    return { ...period };
  }

  private reduceYearRequest(requests: Array<VacationRequest>, status) {
    const reduceRequests = requests
      .filter((c) => status.includes(c.status))
      .reduce(
        (a: any, b: any) => ({
          ...a,
          [moment(b.startPeriod).year()]: [
            ...(a[moment(b.startPeriod).year()] || []),
            b,
          ],
        }),
        {},
      );

    return reduceRequests;
  }

  private countDay(list: any) {
    if (!list || !list.length) return 0;
    return list
      .map(
        (item: any) => moment(item.finalDate).diff(item.startDate, 'day') + 1,
      )
      .reduce((a: any, b: any) => a + b);
  }

  private handleRequest(requests: Array<VacationRequest>) {
    const treatRequestApproved = this.reduceYearRequest(requests, ['approved']);
    const treatRequest = this.reduceYearRequest(requests, [
      'approved',
      'refused',
      'requested',
    ]);

    const newRequests = [];

    Object.getOwnPropertyNames(treatRequest).forEach((item) => {
      newRequests.push({
        year: parseInt(item),
        daysEnjoyed: this.countDay(treatRequestApproved[item]),
        requests: treatRequest[item],
      });
    });

    return newRequests.sort((a, b) => a.year - b.year);
  }

  private calculeLimitsPeriod(hiringdate: string, year: number) {
    const endPeriod = moment(hiringdate).year(year + 1);

    const limitEnterprise = endPeriod.clone().add(6, 'month');
    const ultimate = endPeriod.clone().add(11, 'month');

    return {
      limitEnterprise: moment(limitEnterprise).format('YYYY-MM-DD'),
      ultimate: moment(ultimate).format('YYYY-MM-DD'),
    };
  }

  private calculeRangePeriod(hiringdate: string, year: number) {
    const start = moment(hiringdate);
    const end = moment(hiringdate);

    start.year(year);
    end.year(year + 1);

    return { start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD') };
  }

  private calculedYear(requests: Array<VacationRequest>, hiringdate) {
    const lessYearCompany = moment().diff(moment(hiringdate), 'year') === 0;

    // considers the current year if you have less than 1 year in the company
    if (lessYearCompany) {
      return moment().year();
    }

    // considers one year and 3 months for employees who do not have requested vacations
    if (!requests.length) {
      return moment().subtract(15, 'month').year();
    }

    const treatRequest = this.handleRequest(requests);
    let year = moment().year();

    // take the oldest date and highlight it, if the period is in default
    const pendingDate = treatRequest
      .sort((a, b) => a.year - b.year)
      .filter((a) => a.daysEnjoyed < MAX_DAYS_PER_PERIOD)
      .shift();

    if (!pendingDate) {
      year = treatRequest.sort((a, b) => a.year - b.year)[0].year + 1;
      return year;
    }
    // if it doesn't find any request it will return the current year
    if (!pendingDate) return year;

    // const oldestDate = pendingDate.requests.sort(
    //   (a, b) =>
    //     parseInt(moment(a.startDate).format('YYYYDDMM')) -
    //     parseInt(moment(b.startDate).format('YYYYDDMM')),
    // )[0].startDate;

    // // check if the year of the period is the one found or refers to the year of the previous period
    // if (moment(oldestDate).month() < moment(hiringdate).month()) {
    //   year = pendingDate.year - 1;
    // } else {
    //   year = pendingDate.year;
    // }
    year = pendingDate.year;

    return year;
  }

  public makePeriodRange(props) {
    const { requests, hiringdate } = props;

    const year = props.year || this.calculedYear(requests, hiringdate);

    return this.calculeRangePeriod(hiringdate, year);
  }

  public makePeriodLimits(props) {
    const { requests, hiringdate } = props;

    const year = props.year || this.calculedYear(requests, hiringdate);

    return this.calculeLimitsPeriod(hiringdate, year);
  }

  public makePeriodDaysAllowed(
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

  public async makePeriodStatus(
    limitEnterprise,
    daysEnjoyed,
    type: CollaboratorType,
  ) {
    const situations = await this.periodStatusService.findAll({
      type,
    });
    let situation;
    let gossip = 0;

    if (daysEnjoyed === MAX_DAYS_PER_PERIOD) {
      situation = situations
        .sort((a, b) => a.limitMonths - b.limitMonths)
        .slice(-1)[0];

      return Promise.resolve(situation);
    }

    situations.forEach((status, index) => {
      if (
        gossip === 0 &&
        moment() > moment(limitEnterprise).subtract(status.limitMonths, 'month')
      ) {
        situation = status;
        gossip = 1;
      }
      if (gossip === 0 && situations.length === index + 1) {
        situation = status;
      }
    });

    return Promise.resolve(situation);
  }
}

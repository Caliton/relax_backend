// coming soon
import moment from 'moment';
import { MAX_DAYS_PER_PERIOD } from 'src/core/enumerators';
import { Collaborator } from '../collaborator/collaborator.entity';
import { VacationRequest } from '../vacationRequest/vacation-request.entity';

export class Period {
  start: string;
  end: string;
  limitEnterprise: string;
  ultimate: string;
  daysAllowed: number;
  daysEnjoyed: number;
  daysBalance: number;

  constructor(private readonly collaborator: Collaborator) {}

  // coming soon
  // public async factoryPeriod() {
  //   const range = this.makePeriodRange(
  //     this.collaborator.requests,
  //     this.collaborator.hiringdate,
  //   );

  //   const limits = this.makePeriodLimits(
  //     this.collaborator.requests,
  //     this.collaborator.hiringdate,
  //   );

  //   const daysControll = this.makePeriodDaysAllowed(
  //     this.collaborator.requests,
  //     { start, end },
  //   );

  //   const situation = await this.makePeriodStatus(
  //     limits.limitEnterprise,
  //     this.collaborator.hiringdate,
  //     daysControll.daysEnjoyed,
  //   );

  //   this.start = range.start;
  //   this.daysAllowed = daysControll.daysAllowed;

  //   return Promise.resolve({ ...range, ...limits, ...daysControll, situation });
  // }

  private reduceYearRequest(requests: Array<VacationRequest>) {
    return requests
      .filter((c) => c.status === 'approved')
      .reduce(
        (a: any, b: any) => ({
          ...a,
          [moment(b.startDate).year()]: [
            ...(a[moment(b.startDate).year()] || []),
            b,
          ],
        }),
        {},
      );
  }

  private handleRequest(requests: Array<VacationRequest>) {
    const treatRequest = this.reduceYearRequest(requests);

    const countDay = (list: any) =>
      list
        .map((item: any) => moment(item.finalDate).diff(item.startDate, 'day'))
        .reduce((a: any, b: any) => a + b);

    const newRequests = [];

    Object.getOwnPropertyNames(treatRequest).forEach((item) => {
      newRequests.push({
        year: parseInt(item),
        daysEnjoyed: countDay(treatRequest[item]),
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

    // if it doesn't find any request it will return the current year
    if (!pendingDate) return year;

    const oldestDate = pendingDate.requests
      .sort((a, b) => a.startDate - b.startDate)
      .shift().startDate;

    // check if the year of the period is the one found or refers to the year of the previous period
    if (moment(oldestDate).month() < moment(hiringdate).month()) {
      year = pendingDate.year - 1;
    } else {
      year = pendingDate.year;
    }
    return year;
  }

  private makePeriodRange(requests: Array<VacationRequest>, hiringdate) {
    const year = this.calculedYear(requests, hiringdate);

    return this.calculeRangePeriod(hiringdate, year);
  }

  private makePeriodLimits(requests: Array<VacationRequest>, hiringdate) {
    const year = this.calculedYear(requests, hiringdate);

    return this.calculeLimitsPeriod(hiringdate, year);
  }

  private makePeriodDaysAllowed(
    requests: Array<VacationRequest>,
    period: Period,
  ) {
    const daysAllowed = MAX_DAYS_PER_PERIOD;

    let daysEnjoyed = 0;
    let daysBalance = 0;

    if (requests.length) {
      const requestAgroupYear = this.handleRequest(requests);

      const requestCurrent = requestAgroupYear.find(
        (request) => request.year === period.start,
      );

      daysEnjoyed = requestCurrent ? requestCurrent.daysEnjoyed : 0;
    }

    daysBalance = daysAllowed - daysEnjoyed;

    return {
      daysAllowed,
      daysEnjoyed,
      daysBalance,
    };
  }

  private async makePeriodStatus(limitEnterprise, daysEnjoyed) {
    const situations = await this.periodStatusService.findAll();
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

class PeriodRange {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  start: string;
  end: string;
}

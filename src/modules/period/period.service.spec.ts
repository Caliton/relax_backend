import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { CollaboratorService } from '../collaborator/collaborator.service';
import { PeriodStatusService } from '../periodStatus/period-status.service';
import { PeriodService } from './period.service';

export type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    // ...
  }),
);

describe('PeriodService', () => {
  let service: PeriodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeriodService,
        PeriodStatusService,
        {
          provide: CollaboratorService,
          useFactory: createMock<CollaboratorService>(),
        },
      ],
    }).compile();
    service = module.get<PeriodService>(PeriodService);
  });

  it('should return', async () => {
    const data = {
      requests: [],
      hiringdate: '2015-01-01',
      year: 2022,
    };

    expect(service.makePeriodRange(data)).toBe(true);
  });
});

function createMock<T>(): (...args: any[]) => any {
  console.log('oi');
  return;
}

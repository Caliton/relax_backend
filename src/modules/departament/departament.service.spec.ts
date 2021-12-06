import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departament } from './departament.entity';
import { DepartamentService } from './departament.service';

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

describe('DepartamentService', () => {
  let service: DepartamentService;
  let repositoryMock: MockType<Repository<Departament>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartamentService,
        // Provide your mock instead of the actual repository
        {
          provide: getRepositoryToken(Departament),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    service = module.get<DepartamentService>(DepartamentService);
    repositoryMock = module.get(getRepositoryToken(Departament));
  });

  it('should find a user', async () => {
    const user = repositoryMock.findOne();
    console.log(user);
    expect(service.cachorro()).toBe(true);
  });
});

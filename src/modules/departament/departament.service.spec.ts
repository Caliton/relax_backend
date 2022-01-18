import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Departament } from './departament.entity';
import { DepartamentService } from './departament.service';

const createMock = jest.fn((dto: any) => {
  return dto;
});

const saveMock = jest.fn((dto: any) => {
  return dto;
});

const MockRepository = jest.fn().mockImplementation(() => {
  return {
    create: createMock,
    save: saveMock,
  };
});

const mockRepository = new MockRepository();

describe('DepartamentService', () => {
  let service: DepartamentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartamentService,
        {
          provide: getRepositoryToken(Departament),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DepartamentService>(DepartamentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return departament', () => {
    expect(service.cachorro()).toBe(true);
  });
});

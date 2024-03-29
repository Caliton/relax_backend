import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holiday } from './holiday.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { HolidaysRelax } from './holidays.validation';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidayRepository: Repository<Holiday>,
    private http: HttpService,
  ) {}

  async findAll(year: number) {
    const { data: currentDate } = await firstValueFrom(
      this.http.get(
        'https://brasilapi.com.br/api/feriados/v1/{year}'.replace(
          '{year}',
          year.toString(),
        ),
      ),
    );

    const { data: previousDate } = await firstValueFrom(
      this.http.get(
        'https://brasilapi.com.br/api/feriados/v1/{year}'.replace(
          '{year}',
          (year - 1).toString(),
        ),
      ),
    );

    const { data: nextDate } = await firstValueFrom(
      this.http.get(
        'https://brasilapi.com.br/api/feriados/v1/{year}'.replace(
          '{year}',
          (year + 1).toString(),
        ),
      ),
    );

    const { data: next2Date } = await firstValueFrom(
      this.http.get(
        'https://brasilapi.com.br/api/feriados/v1/{year}'.replace(
          '{year}',
          (year + 2).toString(),
        ),
      ),
    );

    const holidayDb = await this.holidayRepository.find();

    const x = new HolidaysRelax(year);

    console.log(x);

    return [
      ...previousDate,
      ...currentDate,
      ...holidayDb,
      ...nextDate,
      ...next2Date,
    ];
  }

  async findAllRegional() {
    return await this.holidayRepository.find();
  }

  async findOneOrFail(id: string) {
    try {
      return await this.holidayRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(data: Holiday) {
    return await this.holidayRepository.save(
      this.holidayRepository.create(data),
    );
  }

  async update(id: string, data: Holiday) {
    const holiday = await this.findOneOrFail(id);

    this.holidayRepository.merge(holiday, data);
    return await this.holidayRepository.save(holiday);
  }

  async deleteById(id: string) {
    await this.holidayRepository.delete(id);
  }
}

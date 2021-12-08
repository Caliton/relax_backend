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
    const { data } = await firstValueFrom(
      this.http.get(
        'https://brasilapi.com.br/api/feriados/v1/{year}'.replace(
          '{year}',
          year.toString(),
        ),
      ),
    );

    const holidayDb = await this.holidayRepository.find();

    const x = new HolidaysRelax(year);

    console.log(x);

    return [...data, ...holidayDb];
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
    await this.holidayRepository.softDelete(id);
  }
}

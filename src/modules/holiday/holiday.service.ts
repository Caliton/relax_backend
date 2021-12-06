import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holiday } from './holiday.entity';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidayRepository: Repository<Holiday>,
  ) {}

  async findAll() {
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

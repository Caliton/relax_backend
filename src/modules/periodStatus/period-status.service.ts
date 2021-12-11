import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PeriodStatus } from './period-status.entity';

@Injectable()
export class PeriodStatusService {
  constructor(
    @InjectRepository(PeriodStatus)
    private readonly profileRepository: Repository<PeriodStatus>,
  ) {}

  async findAll(query) {
    let { type } = query;
    if (!type) type = '';

    return await this.profileRepository.find({
      where: { type: Like(`%${type}%`) },
      order: {
        limitMonths: 'ASC',
      },
    });
  }

  async findOneOrFail(id: string) {
    try {
      return await this.profileRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(data: PeriodStatus) {
    return await this.profileRepository.save(
      this.profileRepository.create(data),
    );
  }

  async update(id: string, data: PeriodStatus) {
    const profile = await this.findOneOrFail(id);

    this.profileRepository.merge(profile, data);
    return await this.profileRepository.save(profile);
  }

  async deleteById(id: string) {
    await this.profileRepository.softDelete(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestStatusDto } from './dto/request-status.dto';
import { VacationRequest } from './vacation-request.entity';

@Injectable()
export class VacationRequestService {
  constructor(
    @InjectRepository(VacationRequest)
    private readonly vacationRequestRepo: Repository<VacationRequest>,
  ) {}

  async findAll() {
    return await this.vacationRequestRepo.find();
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

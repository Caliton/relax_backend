import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestStatus } from './request-status.entity';

@Injectable()
export class RequestStatusService {
  // async findAll() {
  //   return await this.requestRepo.find();
  // }
  // async findOneOrFail(id: string) {
  //   try {
  //     return await this.requestRepo.findOneOrFail(id);
  //   } catch (error) {
  //     throw new NotFoundException(error.message);
  //   }
  // }
  // async create(data: RequestStatus) {
  //   return await this.requestRepo.save(this.requestRepo.create(data));
  // }
  // async update(id: string, data: RequestStatus) {
  //   const request = await this.findOneOrFail(id);
  //   this.requestRepo.merge(request, data);
  //   return await this.requestRepo.save(request);
  // }
  // async deleteById(id: string) {
  //   await this.requestRepo.softDelete(id);
  // }
}

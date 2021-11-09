import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departament } from './departament.entity';

@Injectable()
export class DepartamentService {
  constructor(
    @InjectRepository(Departament)
    private readonly departRepository: Repository<Departament>,
  ) {}

  async findAll() {
    return await this.departRepository.find();
  }

  async findOneOrFail(id: string) {
    try {
      return await this.departRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(data: Departament) {
    return await this.departRepository.save(this.departRepository.create(data));
  }

  async update(id: string, data: Departament) {
    const departament = await this.findOneOrFail(id);

    this.departRepository.merge(departament, data);
    return await this.departRepository.save(departament);
  }

  async deleteById(id: string) {
    await this.departRepository.softDelete(id);
  }
}

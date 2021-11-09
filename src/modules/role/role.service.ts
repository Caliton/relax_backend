import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll() {
    return await this.roleRepository.find();
  }

  async findOneOrFail(id: string) {
    try {
      return await this.roleRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(data: Role) {
    return await this.roleRepository.save(this.roleRepository.create(data));
  }

  async update(id: string, data: Role) {
    const role = await this.findOneOrFail(id);

    this.roleRepository.merge(role, data);
    return await this.roleRepository.save(role);
  }

  async deleteById(id: string) {
    await this.roleRepository.softDelete(id);
  }
}

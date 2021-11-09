import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async findAll() {
    return await this.profileRepository.find();
  }

  async findOneOrFail(id: string) {
    try {
      return await this.profileRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(data: Profile) {
    return await this.profileRepository.save(
      this.profileRepository.create(data),
    );
  }

  async update(id: string, data: Profile) {
    const profile = await this.findOneOrFail(id);

    this.profileRepository.merge(profile, data);
    return await this.profileRepository.save(profile);
  }

  async deleteById(id: string) {
    await this.profileRepository.softDelete(id);
  }
}

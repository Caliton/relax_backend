import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findAll() {
    return await this.companyRepository.find();
  }

  async findOneOrFail(id: string) {
    try {
      return await this.companyRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(data: Company) {
    return await this.companyRepository.save(
      this.companyRepository.create(data),
    );
  }

  async update(id: string, data: Company) {
    const company = await this.findOneOrFail(id);

    this.companyRepository.merge(company, data);
    return await this.companyRepository.save(company);
  }

  async deleteById(id: string) {
    await this.companyRepository.softDelete(id);
  }
}

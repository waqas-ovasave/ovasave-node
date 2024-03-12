import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/baseservice/base.service';
import { Clinic } from './entities/clinic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';

@Injectable()
export class ClinicsService extends BaseService<Clinic> {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
    protected readonly errorHandlingService: ErrorHandlingService,
  ) {
    super(clinicRepository, errorHandlingService); // Calling the super constructor with the injected repository
  }
  async addSingleClinic(createClinic) {
    const result = await super.create(createClinic);
    return result;
  }

  async findAllClinics() {
    const result = await super.findAll();
    return result;
  }

  async findSingleClinic(id: number) {
    const result = await super.findSingle({ id: id });
    return result;
  }

  async updateClinic(id: number, updateClinic) {
    const result = await super.update(id, updateClinic);
    return result;
  }

  async removeClinic(id: number) {
    const result = await super.delete(id);
    return result;
  }
}

import { Module } from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { ClinicsController } from './clinics.controller';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';
import { Clinic } from './entities/clinic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic])],
  controllers: [ClinicsController],
  providers: [ClinicsService, ErrorHandlingService],
})
export class ClinicsModule {}

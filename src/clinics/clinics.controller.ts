import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-clinic')
  addClinic(@Body() createClinic) {
    return this.clinicsService.addSingleClinic(createClinic);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.clinicsService.findAllClinics();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.clinicsService.findSingleClinic(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateClinic) {
    return this.clinicsService.updateClinic(id, updateClinic);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.clinicsService.removeClinic(id);
  }
}

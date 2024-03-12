import { Module } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { ContactUsController } from './contact-us.controller';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';
import { ContactUs } from './entities/contact-us.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ContactUs])],
  controllers: [ContactUsController],
  providers: [ContactUsService, ErrorHandlingService],
})
export class ContactUsModule {}

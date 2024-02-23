import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorHandlingService } from '../error-handling/error-handling.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    ErrorHandlingService,
    PaginationService,
    EmailService,
  ],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}

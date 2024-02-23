import { ConfigModuleENV } from './config/config.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { ErrorHandlingService } from './error-handling/error-handling.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PaginationService } from './pagination/pagination.service';
import { EmailService } from './email/email.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModuleENV,
    AuthModule,
    DatabaseModule,
    PassportModule,
    UserModule,
    DatabaseModule,
    MulterModule.register(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ErrorHandlingService,
    PaginationService,
    EmailService,
  ],
})
export class AppModule {}
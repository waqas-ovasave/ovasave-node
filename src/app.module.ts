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
import { PaymentModule } from './payment/payment.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ContactUsModule } from './contact-us/contact-us.module';
import { ClinicsModule } from './clinics/clinics.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModuleENV,
    AuthModule,
    DatabaseModule,
    PassportModule,
    UserModule,
    DatabaseModule,
    MulterModule.register(),
    PaymentModule,
    SubscriptionModule,
    ContactUsModule,
    ClinicsModule,
    ProductsModule,
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

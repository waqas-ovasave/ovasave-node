import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeService } from './stripe/stripe.service';
import { Orders } from './entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';
import { UserModule } from 'src/user/user.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Orders]), UserModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    StripeService,
    ErrorHandlingService,
    EmailService,
  ],
})
export class PaymentModule {}

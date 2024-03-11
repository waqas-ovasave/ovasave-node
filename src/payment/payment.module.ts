import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeService } from './stripe/stripe.service';
import { Orders } from './entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';

@Module({
  imports: [TypeOrmModule.forFeature([Orders])],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService, ErrorHandlingService],
})
export class PaymentModule {}

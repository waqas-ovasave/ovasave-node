import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('stripe/checkout')
  handleWebhookEvent(@Body() paymentReq) {
    return this.paymentService.create(paymentReq);
  }

  @UseGuards(JwtAuthGuard)
  @Post('success')
  async handlePaymentSuccess(@Body() body, @Request() req) {
    const sessionId = body.sessionId;
    const userId = req.user.userId;
    return this.paymentService.verifyPayment(sessionId, userId);
  }
}

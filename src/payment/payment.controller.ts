import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('stripe/checkout')
  handleWebhookEvent(@Body() paymentReq) {
    return this.paymentService.create(paymentReq);
  }

  @UseGuards(JwtAuthGuard)
  @Post('success')
  async handlePaymentSuccessUser(@Body() body, @Request() req) {
    const sessionId = body.sessionId;
    const userId = req.user.userId;
    return this.paymentService.verifyPayment(sessionId, userId);
  }

  // for guest users only
  @Post('success-guest')
  async handlePaymentSuccessGuestUser(@Body() body) {
    const sessionId = body.sessionId;
    const userId = 0;
    return this.paymentService.verifyPayment(sessionId, userId);
  }
}

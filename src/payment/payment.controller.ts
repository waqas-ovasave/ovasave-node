import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // checkout for logged in user
  @UseGuards(JwtAuthGuard)
  @Post('stripe/checkout')
  handleWebhookEvent(@Body() paymentReq) {
    return this.paymentService.create(paymentReq);
  }

  // checkout for non-logged in user (guest user only)
  @Post('stripe/checkout-guest')
  handleWebhookEventNonLoggedIn(@Body() createUserBeforePayment) {
    return this.paymentService.guestUser(createUserBeforePayment);
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
    const sessionId = body?.sessionId;
    const userId = body?.userId;
    return this.paymentService.verifyPayment(sessionId, userId);
  }
}

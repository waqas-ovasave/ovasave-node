import { Injectable } from '@nestjs/common';
import { StripeService } from './stripe/stripe.service';

@Injectable()
export class PaymentService {
  constructor(private readonly stripeService: StripeService) {}

  async create(paymentReq) {
    return await this.stripeService.checkOut(paymentReq);
  }
  async verifyPayment(sessionId, userId) {
    // Verify the payment intent using the session ID
    return await this.stripeService.verifyPaymentIntent(sessionId, userId);
  }
}

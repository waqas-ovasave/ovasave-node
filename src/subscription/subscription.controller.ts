import { Controller, Post, Body } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  subscription(@Body() createSubscription) {
    return this.subscriptionService.subscriptionWithEmail(createSubscription);
  }
}

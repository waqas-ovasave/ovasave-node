import { Injectable } from '@nestjs/common';
import { Subscription } from './entities/subscription.entity';
import { BaseService } from 'src/baseservice/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';

@Injectable()
export class SubscriptionService extends BaseService<Subscription> {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    protected readonly errorHandlingService: ErrorHandlingService,
  ) {
    super(subscriptionRepository, errorHandlingService); // Calling the super constructor with the injected repository
  }
  async subscriptionWithEmail(createSubscription) {
    const result = await super.create(createSubscription);
    return result;
  }
}

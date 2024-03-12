import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Orders } from '../entities/payment.entity';
import { BaseService } from 'src/baseservice/base.service';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';

@Injectable()
export class StripeService extends BaseService<Orders> {
  private readonly stripe: Stripe;

  constructor(
    @InjectRepository(Orders)
    private readonly paymentRepository: Repository<Orders>,
    protected readonly errorHandlingService: ErrorHandlingService,
  ) {
    super(paymentRepository, errorHandlingService);
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async checkOut(paymentRequest) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: paymentRequest.items.map((item) => {
          return {
            price_data: {
              currency: item.price.currency,
              product_data: {
                name: item.price.product.name,
              },
              unit_amount: item.price.amount * 100,
            },
            quantity: item.quantity,
          };
        }),
        shipping_address_collection: {
          allowed_countries: ['AE'], // Specify the United Arab Emirates (AE) as the allowed country
        },
        success_url: `http://localhost:3000/success`,
        cancel_url: 'http://localhost:3000/cancel',
      });
      const data = { checkOutURL: session.url, sessionId: session.id };
      return data;
    } catch (error) {
      return this.errorHandlingService.handle({
        message: 'Failed to create customer at stripe',
        success: false,
      });
    }
  }

  async verifyPaymentIntent(sessionId: string, userId) {
    try {
      // Retrieve the session
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      // Check if payment is successful
      if (session.payment_status === 'paid') {
        // to get the info related to product from stripe
        const lineItems = await this.stripe.checkout.sessions.listLineItems(
          sessionId,
        );
        const productName = lineItems.data[0].description;
        const productId = lineItems.data[0].id;
        const quantity = lineItems.data[0].quantity;

        // to get the adress from line 1 or line 2
        const newAdress = session.customer_details.address.line1
          ? session.customer_details.address.line1
          : session.customer_details.address.line2;

        // Ensure paymentIntentId is always a string
        const paymentIntentId = String(session.payment_intent);
        const amount = session.amount_total / 100;

        const currency = session.currency;
        const paymentMethod = session.payment_method_types[0];
        const customerDetails = {
          adress: newAdress,
          state: session.customer_details.address.state,
          name: session.customer_details.name,
          email: session.customer_details.email,
        };

        // Save payment information to the database
        const payment: DeepPartial<Orders> = {
          createdBy: userId,
          amount,
          productName,
          productId,
          quantity,
          currency,
          paymentMethod,
          paymentIntentId,
          status: session.payment_status,
          customerDetails: JSON.stringify(customerDetails), //we do strigigy here to save another object in DB , to access that from front-end, parse it
        };
        try {
          return await super.create(payment); //if paymnet data is saved to DB
        } catch (dbError) {
          // Handle the error and return appropriate response
          return this.errorHandlingService.handle({
            message: 'Failed to save payment data to the database',
            success: false,
          });
        }
      } else {
        return this.errorHandlingService.handle({
          message: 'Payment is not paid',
          success: false,
        }); // Payment not successful
      }
    } catch (error) {
      return this.errorHandlingService.handle({
        message: error.message,
        success: false,
      });
    }
  }
}

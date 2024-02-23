// twilio.service.ts

import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioService {
  private readonly client;

  constructor() {
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    this.client = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }

  async sendMessage(body: string, from: string, to: string) {
    try {
      await this.client.messages.create({
        body,
        from,
        to,
      });
      return true;
    } catch (error) {
      console.error('Failed to send message via Twilio:', error);
      return false;
    }
  }
}

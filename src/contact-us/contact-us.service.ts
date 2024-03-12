import { Injectable } from '@nestjs/common';
import * as satelize from 'satelize';
import { ContactUs } from './entities/contact-us.entity';
import { BaseService } from 'src/baseservice/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';

@Injectable()
export class ContactUsService extends BaseService<ContactUs> {
  constructor(
    @InjectRepository(ContactUs)
    private readonly contactUsRepository: Repository<ContactUs>,
    protected readonly errorHandlingService: ErrorHandlingService,
  ) {
    super(contactUsRepository, errorHandlingService); // Calling the super constructor with the injected repository
  }
  async contactUs(contact: any, req: Request, ip: string) {
    const browser = req.headers['user-agent'];
    contact.browser = browser;
    contact.ipAddress = ip;
    const payload = await satelize.satelize(
      { ip: ip },
      async (error, response) => {
        if (response) {
          const location = JSON.stringify({
            ip: response?.ip,
            timezone: response?.timezone,
            coordinates: {
              latitude: response?.latitude,
              longitude: response?.longitude,
              country: response?.country?.en,
              continent: response?.continent?.en,
            },
          });
          const result = await super.create({ ...contact, location });
          return result;
        } else {
          return this.errorHandlingService.handle({
            message: 'error in fetching the user location information',
            statusCode: 500,
            success: false,
          });
        }
      },
    );
    return payload;
  }
}

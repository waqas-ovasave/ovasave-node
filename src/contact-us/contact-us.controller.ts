import { Controller, Post, Body, Req, Ip } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';

@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  create(@Body() createContactUs, @Req() req: Request, @Ip() ip) {
    return this.contactUsService.contactUs(createContactUs, req, ip);
  }
}

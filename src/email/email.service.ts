// email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, //service like gmail or yahoo etc
      host: process.env.EMAIL_HOST, // SMTP server host
      port: +process.env.EMAIL_PORT, // SMTP port (typically 587 for TLS)
      secure: false, // Set to true for secure connections (TLS)
      auth: {
        user: process.env.SENDER_EMAIL, // Your email address...sender mail address
        pass: process.env.SENDER_EMAIL_PASS, // Your email password or application-specific password
      },
    });
  }

  // to, subject and text fields will be received where ever we call this function
  async sendEmail(to: string, subject: string, html: string) {
    // Check if the recipient's email address is provided
    if (!to) {
      throw new Error('No recipients defined');
    }
    const mailOptions = {
      to,
      subject,
      html,
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Email sending failed');
    }
  }
}

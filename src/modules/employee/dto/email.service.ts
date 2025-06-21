import { Injectable, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  // private readonly EMAIL_USER = 'cliniva6@gmail.com';
  private readonly EMAIL_USER = 'ahmad.afuni91@gmail.com';
  // private readonly EMAIL_PASS = 'cliniva@1999';
  private readonly EMAIL_PASS = 'qiti hzgt nzvn taxl';

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.EMAIL_USER,
        pass: this.EMAIL_PASS,
      },
    });
    console.log('Email service initialized');
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateEmailOrThrow(email: string): void {
    if (!this.validateEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }
  }

  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    this.validateEmailOrThrow(to);

    try {
      await this.transporter.sendMail({
        from: this.EMAIL_USER,
        to,
        subject,
        text,
        html: html || text, // Use HTML if provided, otherwise fall back to text
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.log('error while sending email', error.message);
    }
  }
}

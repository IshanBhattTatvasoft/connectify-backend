import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

export class Mailer {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  static async sendMail(to: string, subject?: string, html?: string) {
    Mailer.transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP connection error:', error);
      } else {
        console.log('SMTP server is ready to take messages');
      }
    });
    await this.transporter.sendMail({
      from: `"Connectify Support" <${process.env.EMAIL_ID}>`,
      to,
      subject,
      html,
    });
  }
}

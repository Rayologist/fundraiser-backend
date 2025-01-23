import { env } from '@common/environments/fundraiser.env';
import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private mailer;
  constructor() {
    this.mailer = createTransport({
      host: env.smtpHost,
      port: 465,
      secure: true,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPassword,
      },
    });
  }

  send(args: {
    to: string;
    subject: string;
    html: string;
    attachments?: Attachment[];
  }) {
    return this.mailer.sendMail({
      to: args.to,
      from: env.smtpFrom,
      replyTo: env.smtpReplyTo,
      subject: args.subject,
      html: args.html,
      attachments: args.attachments,
    });
  }
}

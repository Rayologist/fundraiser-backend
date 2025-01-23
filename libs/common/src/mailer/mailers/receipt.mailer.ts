import { EmailService } from '@modules/email/email.service';
import { Mailer } from '../interface/mailer.interface';
import { env } from '@common/environments/fundraiser.env';
import { Receipt, ReceiptService } from '@modules/receipt/receipt.service';
import { readFile } from 'fs/promises';
import { Injectable } from '@nestjs/common';
import { join as pathJoin } from 'path';
import Handlebars from 'handlebars';

export type ReceiptMailerArgs = {
  to: string;
  receipt: Receipt;
};

@Injectable()
export class ReceiptMailer implements Mailer<ReceiptMailerArgs> {
  constructor(
    private readonly emailService: EmailService,
    private readonly receiptService: ReceiptService,
  ) {}
  async send(args: ReceiptMailerArgs): Promise<void> {
    const receiptData = this.receiptService.getReceiptData(args.receipt);
    const fileName = `receipt_${receiptData.receipt.number}.pdf`;
    const html = await this.getEmailHtml({
      year: new Date().getFullYear().toString(),
      receiptNumber: receiptData.receipt.number,
      receiptFileName: fileName,
      donation: {
        date: receiptData.receipt.date,
        amount: receiptData.donation.amount,
        amountInWords: receiptData.donation.amountInWords,
        type: receiptData.donation.type,
      },
      institution: {
        name: receiptData.institute.name,
        phone: receiptData.institute.phone,
      },
    });

    const receiptPdf = await this.receiptService.generateEncryptedPdf(
      args.receipt,
    );

    await this.emailService.send({
      to: args.to,
      subject: env.emailReceiptSubject,
      html,
      attachments: [
        {
          filename: fileName,
          content: receiptPdf ?? '',
        },
      ],
    });
  }

  private async getEmailHtml(args: EmailTemplateArgs) {
    const source = await readFile(
      pathJoin(env.emailPath, env.emailReceiptTemplate),
      'utf-8',
    );
    const template = Handlebars.compile(source);
    return template(args);
  }
}

type EmailTemplateArgs = {
  year: string;
  receiptNumber: string;
  receiptFileName: string;
  donation: {
    date: string;
    amount: string;
    amountInWords: string;
    type: string;
  };
  institution: {
    name: string;
    phone: string;
  };
};

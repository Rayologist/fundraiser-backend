import { env } from '@common/environments/fundraiser.env';
import { PdfService } from '@modules/pdf/pdf.service';
import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join as pathJoin } from 'path';
import { toMandarinNumerals } from './core/mandarin-numerals';
import { imageToDataUrl } from './core/image-converter';
import Handlebars from 'handlebars';

@Injectable()
export class ReceiptService {
  constructor(private readonly pdfService: PdfService) {}

  getReceiptData(receipt: Receipt) {
    const currencyFormatter = new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      maximumFractionDigits: 0,
    });

    let institutionName = env.institutionName;
    let receiptNote = receipt.notes;

    if (env.mode === 'staging') {
      institutionName += '測試收據';
      receiptNote = '此為測試收據 ' + receiptNote;
    }

    const receiptData = {
      institute: {
        name: env.institutionName,
        address: env.institutionAddress,
        taxId: env.institutionTaxId,
        email: env.institutionEmail,
        phone: env.institutionPhone,
      },
      receipt: {
        number: receipt.id,
        date: receipt.date.toISOString().split('T')[0],
        notes: receipt.notes,
      },
      donor: {
        name: receipt.donor.name,
        taxId: receipt.donor.taxId,
      },
      donation: {
        type: receipt.donation.type,
        amount: currencyFormatter.format(receipt.donation.amount),
        amountInWords: toMandarinNumerals(receipt.donation.amount),
        method: receipt.donation.method,
      },
    };

    return receiptData;
  }

  async getHtml(receipt: Receipt) {
    const receiptData = {
      ...this.getReceiptData(receipt),
      seals: {
        org: await imageToDataUrl(pathJoin(env.sealPath, env.sealOrgImage)),
        president: await imageToDataUrl(
          pathJoin(env.sealPath, env.sealPresidentImage),
        ),
        handler: await imageToDataUrl(
          pathJoin(env.sealPath, env.sealHandlerImage),
        ),
      },
    };

    const source = await readFile(env.receiptPath, 'utf-8');

    const template = Handlebars.compile(source);
    const html = template(receiptData);
    return html;
  }

  async generateEncryptedPdf(receipt: Receipt) {
    const html = await this.getHtml(receipt);

    const pdf = await this.pdfService.generate(html);

    return this.pdfService.encrypt({
      source: pdf,
      password: receipt.donor.taxId,
      tmpPath: pathJoin(env.tmpdir, receipt.userId),
    });
  }
}

export type Receipt = {
  id: string;
  userId: string;
  date: Date;
  notes: string;
  donor: {
    name: string;
    taxId: string;
  };
  donation: {
    type: string;
    amount: number;
    method: string;
  };
};

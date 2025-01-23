import { EmailModule } from '@modules/email/email.module';
import { Module } from '@nestjs/common';
import { ReceiptMailer } from './mailers/receipt.mailer';
import { ReceiptModule } from '@modules/receipt/receipt.module';

const providers = [ReceiptMailer];

@Module({
  imports: [EmailModule, ReceiptModule],
  providers,
  exports: providers,
})
export class MailerModule {}

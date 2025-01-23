import { PdfModule } from '@modules/pdf/pdf.module';
import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service';

@Module({
  imports: [PdfModule],
  providers: [ReceiptService],
  exports: [ReceiptService],
})
export class ReceiptModule {}

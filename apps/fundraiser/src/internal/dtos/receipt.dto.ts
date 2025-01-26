import { ZodToCls } from '@common/decorators/zod-validation.pipe';
import { z } from 'zod';

export const sendReceiptSchema = z.object({
  to: z.string().min(1),
});

export class SendReceiptDto extends ZodToCls(sendReceiptSchema) {}

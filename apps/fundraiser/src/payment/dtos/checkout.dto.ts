import { ZodToCls } from '@common/decorators/zod-validation.pipe';
import { z } from 'zod';

export const donorInfoSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email().min(1),
  isGILMember: z.boolean(),
  receiptRequest: z.boolean(),
  receiptName: z.string().nullable(),
  taxId: z.string().nullable(),
  phoneNumber: z.string().nullable(),
});

export class DonorInfoDto extends ZodToCls(donorInfoSchema) {}

export const checkoutSchema = z.object({
  cartItemIds: z.array(z.string()),
  donorInfo: donorInfoSchema,
});

export class CheckoutDto extends ZodToCls(checkoutSchema) {}

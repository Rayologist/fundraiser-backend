import { ZodToCls } from '@common/decorators/zod-validation.pipe';
import { z } from 'zod';

const updateCartItemSchema = z.object({
  //   quantity: z.number().int().optional(),
  price: z.number().int().optional(),
});

export class UpdateCartItemDto extends ZodToCls(updateCartItemSchema) {}

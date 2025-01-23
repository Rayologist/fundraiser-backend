import { ZodToCls } from '@common/decorators/zod-validation.pipe';
import { z } from 'zod';

export const addCartItemSchema = z.object({
  productId: z.string().min(1),
});

export class AddCartItemDto extends ZodToCls(addCartItemSchema) {}

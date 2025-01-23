import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { z, ZodSchema } from 'zod';

export interface ZodToClsConstructor<T> {
  new (args: T): T;
  schema: ZodSchema;
}

export function ZodToCls<Z extends ZodSchema, T extends z.infer<Z>>(
  schema: Z,
): ZodToClsConstructor<T> {
  class cls {
    constructor(args: z.infer<Z>) {
      Object.assign(this, args);
    }
    static schema: Z = schema;
  }

  return cls as any;
}

export class ZodValidationPipe implements PipeTransform {
  constructor() {}

  async transform(value: unknown, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }

    const cls = metadata?.metatype as ZodToClsConstructor<unknown>;
    try {
      const parsedValue = await cls.schema.parseAsync(value);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  private toValidate(metaType: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metaType);
  }
}

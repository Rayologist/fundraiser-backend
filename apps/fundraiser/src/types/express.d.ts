import { Context } from '@common/types';

declare global {
  namespace Express {
    interface Request {
      context: Context;
    }
  }
}

export {};

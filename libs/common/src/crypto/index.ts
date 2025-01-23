import { env } from '@common/environments/fundraiser.env';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

export function generateRefreshToken() {
  return randomBytes(19).toString('base64');
}

export class TaxId {
  static encrypt(value: string) {
    const cipher = createCipheriv(
      'aes-256-cbc',
      env.taxIdKey,
      Buffer.from(env.taxIdIV),
    );
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
  }

  static decrypt(value: string) {
    try {
      const decipher = createDecipheriv(
        'aes-256-cbc',
        env.taxIdKey,
        env.taxIdIV,
      );
      let decrypted = decipher.update(value, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      return null;
    }
  }
}

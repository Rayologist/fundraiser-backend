import { createCipheriv, createDecipheriv, createHash } from 'crypto';

export class Crypto {
  AES_ALGORITHM = 'aes-256-cbc';
  constructor(
    private readonly hashKey: string,
    private readonly hashIV: string,
  ) {}

  encrypt(input: string) {
    const cipher = createCipheriv(
      this.AES_ALGORITHM,
      this.hashKey,
      this.hashIV,
    );
    const encrypted = cipher.update(input, 'binary', 'hex');
    return encrypted + cipher.final('hex');
  }

  hashSHA256(string: string) {
    const sha256 = createHash('sha256').update(string);
    return sha256.digest('hex').toUpperCase();
  }

  validateSHA(other: string, original: string) {
    return this.hashSHA256(other) === original;
  }

  decrypt(input: string) {
    const decipher = createDecipheriv(
      this.AES_ALGORITHM,
      this.hashKey,
      this.hashIV,
    );

    decipher.setAutoPadding(false);

    const cipher = decipher.update(input, 'hex', 'utf8');

    const result = cipher + decipher.final('utf8');

    const decrypted = result.replace(/[\x00-\x20]/g, '');

    return decrypted;
  }
}

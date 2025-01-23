import { NestFactory } from '@nestjs/core';
import { FundraiserModule } from './fundraiser.module';
import { RequestMethod } from '@nestjs/common';
import { env } from '@common/environments/fundraiser.env';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ZodValidationPipe } from '@common/decorators/zod-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(FundraiserModule);

  app.use(cookieParser(env.cookieSecret));
  app.use(helmet());
  app.useGlobalPipes(new ZodValidationPipe());

  app.setGlobalPrefix('v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  await app.listen(process.env.port ?? 3000);
}
bootstrap();

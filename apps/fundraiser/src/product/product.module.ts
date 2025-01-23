import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductDomainModule } from '@domains/fundraiser/product/product.module';

@Module({
  imports: [ProductDomainModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}

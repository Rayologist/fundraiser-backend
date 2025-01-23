import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(@Query('campaignId') campaignId?: string) {
    return this.productService.findAll({ campaignId });
  }

  @Get('recommended')
  recommended() {
    return this.productService.findRecommended();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
}

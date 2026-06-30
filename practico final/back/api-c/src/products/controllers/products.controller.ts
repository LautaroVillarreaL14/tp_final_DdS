import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Product } from '../product.types';
import { CreateProductInput } from '../DTOs/create.product.input';
import { UpdateProductInput } from '../DTOs/update.product.input';
//import { LimitOnUpdateNotSupportedError, NumericType } from 'typeorm';
import { PaginationResponse } from '../../common/types/pagination.types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query('page') page:number=1, @Query('limit') limit=50): Promise<PaginationResponse<Product>> {
    return this.productsService.findAll(page,limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(Number(id));
  }

  @Post()//Listo
  create(@Body() body: CreateProductInput): Promise<Product> {
    return this.productsService.create(body);
  }

  @Put(':id')//Haciendo
  update(@Param('id') id: string, @Body() body: UpdateProductInput): Promise<Product> {
    return this.productsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Product> {
    return this.productsService.remove(Number(id));
  }

  @Patch(':id/stock')
  updateStock(@Param('id', ParseIntPipe) id: number, @Body('stock') stock: number): Promise<Product | undefined>{
    return this.productsService.updateStock(id,stock);
  }

  

}


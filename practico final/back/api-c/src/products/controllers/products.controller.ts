import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Product } from '../product.types';
import { CreateProductInput } from '../DTOs/create.product.input';
import { UpdateProductInput } from '../DTOs/update.product.input';
import { AuthService } from '../../auth/auth.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
  ): Promise<any> {
    const result = await this.productsService.findAll(page, limit);
    return {
      items: result.data,
      total: result.meta.total,
      page: result.meta.page,
      limit: result.meta.limit,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(Number(id));
  }

  @Post()
  async create(@Body() body: CreateProductInput, @Headers('authorization') auth?: string): Promise<Product> {
    await this.requireAdmin(auth);
    return this.productsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProductInput, @Headers('authorization') auth?: string): Promise<Product> {
    await this.requireAdmin(auth);
    return this.productsService.update(Number(id), body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Headers('authorization') auth?: string): Promise<Product> {
    await this.requireAdmin(auth);
    return this.productsService.remove(Number(id));
  }

  @Patch(':id/stock')
  updateStock(@Param('id', ParseIntPipe) id: number, @Body('stock') stock: number): Promise<Product | undefined>{
    return this.productsService.updateStock(id,stock);
  }

  private async requireUser(auth?: string) {
    const token = auth?.replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('Missing token');
    const user = await this.authService.meFromToken(token);
    if (!user) throw new UnauthorizedException('Invalid token');
    return user;
  }

  private async requireAdmin(auth?: string) {
    const user = await this.requireUser(auth);
    if (user.role !== 'admin') throw new ForbiddenException('Admin privilege required');
    return user;
  }
}


import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import {
  PRODUCTS_REPOSITORY,
  ProductsRepository,
} from '../repositories/products.repository';
import { PaginationResponse } from '../../common/types/pagination.types';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  async findAll(page:number,limit:number): Promise<PaginationResponse<Product>> {
    page = page > 50 ? 50 : page < 1 ? 1 : page
    return this.productsRepository.findAll(page,limit);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(input: CreateProductInput): Promise<Product> {
    return this.productsRepository.create(input);
  }

  async update(id: number, input: UpdateProductInput): Promise<Product> {
    const product = await this.productsRepository.update(id, input);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: number): Promise<Product> {
    const product = await this.productsRepository.remove(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async partialUpdate(id: number, data: Partial<Product>): Promise<Product | undefined> {
    return this.productsRepository.partialUpdate(id,data);
  }

  async updateStock(id: number, stock: number): Promise<Product | undefined>{
    return this.productsRepository.updateStock(id, stock);
  }
}


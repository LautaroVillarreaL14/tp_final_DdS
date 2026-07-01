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
    return this.enrichProduct(product);
  }

  async create(input: CreateProductInput): Promise<Product> {
    const created = await this.productsRepository.create(input);
    return this.enrichProduct(created);
  }

  async update(id: number, input: UpdateProductInput): Promise<Product> {
    const product = await this.productsRepository.update(id, input);
    if (!product) throw new NotFoundException('Product not found');
    return this.enrichProduct(product);
  }

  async remove(id: number): Promise<Product> {
    const product = await this.productsRepository.remove(id);
    if (!product) throw new NotFoundException('Product not found');
    return this.enrichProduct(product);
  }

  async partialUpdate(id: number, data: Partial<Product>): Promise<Product | undefined> {
    const result = await this.productsRepository.partialUpdate(id,data);
    return result ? this.enrichProduct(result) : undefined;
  }

  async updateStock(id: number, stock: number): Promise<Product | undefined>{
    const result = await this.productsRepository.updateStock(id, stock);
    return result ? this.enrichProduct(result) : undefined;
  }

  private enrichProduct(product: Product): Product {
    const categoryId = (product as any).categoryId ?? 1;
    return {
      ...product,
      category: categoryId ? { id: categoryId, name: `Category ${categoryId}` } : null,
    } as Product;
  }
}


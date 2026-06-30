import { ProductsRepository } from './products.repository';
import { CreateProductInput } from '../DTOs/create.product.input';
import { UpdateProductInput } from '../DTOs/update.product.input';
import { Product }  from '../product.types';
import { PaginationResponse } from '../../common/types/pagination.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../product.entity';

export class ProductTypeOrmRepository implements ProductsRepository {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly repository : Repository<ProductEntity>
    ){}


  async findAll(page:number,limit:number): Promise<PaginationResponse<Product>> {
    const [data, total] =await  this.repository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });
    return {
      data: data as Product[],
      meta : {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async findById(id: number): Promise<Product | undefined> {
    const product = await this.repository.findOneBy({id});
    return product ?? undefined;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const product = this.repository.create({
      name:input.name,
      price:input.price,
      stock:input.stock,
      categoryId:input.categoryId ?? 1
    })
    return await this.repository.save(product) as Product;
  }

  async update(id: number, input: UpdateProductInput): Promise<Product | undefined> {
    const product = await this.repository.findOneBy({ id });
    if (!product) return undefined;
    Object.assign(product, input);
    const saved = await this.repository.save(product);
    return saved as unknown as Product;
}

  async remove(id: number): Promise<Product | undefined> {
    const product = await this.repository.findOneBy({id});
    if (!product) return undefined;
    await this.repository.remove(product)
    return product as unknown as Product;
  }

  async partialUpdate(id: number, data: Partial<Product>): Promise<Product | undefined> {
    const product = await this.repository.findOneBy({id});
    if (!product) return undefined;
    Object.assign(product, data);
    return await this.repository.save(product) as Product;
  }

  async updateStock(id: number, stock: number): Promise<Product | undefined> {
    const product = await this.repository.findOneBy({id});
    if (!product) return undefined;
    product.stock = stock;
    return await this.repository.save(product) as Product;
  }
}
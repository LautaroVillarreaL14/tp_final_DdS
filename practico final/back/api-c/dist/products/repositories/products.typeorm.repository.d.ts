import { ProductsRepository } from './products.repository';
import { CreateProductInput } from '../DTOs/create.product.input';
import { UpdateProductInput } from '../DTOs/update.product.input';
import { Product } from '../product.types';
import { PaginationResponse } from '../../common/types/pagination.types';
import { Repository } from 'typeorm';
import { ProductEntity } from '../product.entity';
export declare class ProductTypeOrmRepository implements ProductsRepository {
    private readonly repository;
    constructor(repository: Repository<ProductEntity>);
    findAll(page: number, limit: number): Promise<PaginationResponse<Product>>;
    findById(id: number): Promise<Product | undefined>;
    create(input: CreateProductInput): Promise<Product>;
    update(id: number, input: UpdateProductInput): Promise<Product | undefined>;
    remove(id: number): Promise<Product | undefined>;
    partialUpdate(id: number, data: Partial<Product>): Promise<Product | undefined>;
    updateStock(id: number, stock: number): Promise<Product | undefined>;
}

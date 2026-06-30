import { PaginationResponse } from '../../common/types/pagination.types';
import { CreateProductInput, Product, UpdateProductInput } from '../product.types';
export declare const PRODUCTS_REPOSITORY = "PRODUCTS_REPOSITORY";
export interface ProductsRepository {
    findAll(page: number, limit: number): Promise<PaginationResponse<Product>>;
    findById(id: number): Promise<Product | undefined>;
    create(input: CreateProductInput): Promise<Product>;
    update(id: number, input: UpdateProductInput): Promise<Product | undefined>;
    remove(id: number): Promise<Product | undefined>;
    partialUpdate(id: number, data: Partial<Product>): Promise<Product | undefined>;
    updateStock(id: number, stock: number): Promise<Product | undefined>;
}

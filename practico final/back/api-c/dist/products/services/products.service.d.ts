import { CreateProductInput, Product, UpdateProductInput } from '../product.types';
import { ProductsRepository } from '../repositories/products.repository';
import { PaginationResponse } from '../../common/types/pagination.types';
export declare class ProductsService {
    private readonly productsRepository;
    constructor(productsRepository: ProductsRepository);
    findAll(page: number, limit: number): Promise<PaginationResponse<Product>>;
    findOne(id: number): Promise<Product>;
    create(input: CreateProductInput): Promise<Product>;
    update(id: number, input: UpdateProductInput): Promise<Product>;
    remove(id: number): Promise<Product>;
    partialUpdate(id: number, data: Partial<Product>): Promise<Product | undefined>;
    updateStock(id: number, stock: number): Promise<Product | undefined>;
}

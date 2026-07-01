import { ProductsService } from '../services/products.service';
import { Product } from '../product.types';
import { CreateProductInput } from '../DTOs/create.product.input';
import { UpdateProductInput } from '../DTOs/update.product.input';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(page?: number, limit?: number): Promise<any>;
    findOne(id: string): Promise<Product>;
    create(body: CreateProductInput): Promise<Product>;
    update(id: string, body: UpdateProductInput): Promise<Product>;
    remove(id: string): Promise<Product>;
    updateStock(id: number, stock: number): Promise<Product | undefined>;
}

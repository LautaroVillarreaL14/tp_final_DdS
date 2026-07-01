import { ProductsService } from '../services/products.service';
import { Product } from '../product.types';
import { CreateProductInput } from '../DTOs/create.product.input';
import { UpdateProductInput } from '../DTOs/update.product.input';
import { AuthService } from '../../auth/auth.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly authService;
    constructor(productsService: ProductsService, authService: AuthService);
    findAll(page?: number, limit?: number): Promise<any>;
    findOne(id: string): Promise<Product>;
    create(body: CreateProductInput, auth?: string): Promise<Product>;
    update(id: string, body: UpdateProductInput, auth?: string): Promise<Product>;
    remove(id: string, auth?: string): Promise<Product>;
    updateStock(id: number, stock: number): Promise<Product | undefined>;
    private requireUser;
    private requireAdmin;
}

import { CategoriesService } from '../services/categories.service';
import { Category, CreateCategoryInput } from '../categories.types';
import { AuthService } from '../../auth/auth.service';
export declare class CategoriesController {
    private readonly categoriesService;
    private readonly authService;
    constructor(categoriesService: CategoriesService, authService: AuthService);
    findAll(auth?: string, page?: number, limit?: number): Promise<any>;
    findOne(id: string, auth?: string): Promise<Category | null>;
    create(body: CreateCategoryInput, auth?: string): Promise<Category>;
    update(id: string, body: CreateCategoryInput, auth?: string): Promise<Category>;
    delete(id: string, auth?: string): Promise<void>;
    private requireUser;
    private requireAdmin;
}

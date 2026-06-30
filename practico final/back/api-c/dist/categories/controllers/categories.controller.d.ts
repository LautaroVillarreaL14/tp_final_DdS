import { CategoriesService } from '../services/categories.service';
import { Category, CreateCategoryInput } from '../categories.types';
import { PaginationResponse } from '../../common/types/pagination.types';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(page?: number, limit?: number): Promise<PaginationResponse<Category>>;
    finOne(id: string): Promise<Category | null>;
    crate(body: CreateCategoryInput): Promise<Category>;
    delete(id: string): Promise<void>;
}

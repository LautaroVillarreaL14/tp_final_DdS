import { PaginationResponse } from '../../common/types/pagination.types';
import { Category, CreateCategoryInput } from '../categories.types';
export declare const CATEGORIES_REPOSITORY = "CATEGORIES_REPOSITORY";
export interface CategoriesRepository {
    findAll(page: number, limit: number): Promise<PaginationResponse<Category>>;
    findById(id: number): Promise<Category | null>;
    create(input: CreateCategoryInput): Promise<Category>;
    delete(id: number): Promise<void>;
}

import { PaginationResponse } from '../../common/types/pagination.types';
import { Category, CreateCategoryInput } from '../categories.types';
export declare const CATEGORIES_REPOSITORY = "CATEGORIES_REPOSITORY";
export interface CategoriesRepository {
    findAll(page: number, limit: number): Promise<PaginationResponse<Category>>;
    findById(id: number): Promise<Category | null>;
    findByName(name: string): Promise<Category | null>;
    create(input: CreateCategoryInput): Promise<Category>;
    update(id: number, input: CreateCategoryInput): Promise<Category | null>;
    delete(id: number): Promise<void>;
}

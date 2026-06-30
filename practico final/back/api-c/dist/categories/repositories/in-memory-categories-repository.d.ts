import { PaginationResponse } from '../../common/types/pagination.types';
import { Category, CreateCategoryInput } from '../categories.types';
import { CategoriesRepository } from './categories.repository';
export declare class inMemoryCategoriesRepository implements CategoriesRepository {
    private categories;
    private nextId;
    findAll(page: number, limit: number): Promise<PaginationResponse<Category>>;
    findById(id: number): Promise<Category | null>;
    create(input: CreateCategoryInput): Promise<Category>;
    delete(id: number): Promise<void>;
}

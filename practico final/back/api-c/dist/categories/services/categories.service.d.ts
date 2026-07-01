import { Category, CreateCategoryInput } from '../categories.types';
import { CategoriesRepository } from '../repositories/categories.repository';
import { PaginationResponse } from '../../common/types/pagination.types';
export declare class CategoriesService {
    private readonly categoriesRepository;
    constructor(categoriesRepository: CategoriesRepository);
    findAll(page: number, limit: number): Promise<PaginationResponse<Category>>;
    findById(id: number): Promise<Category | null>;
    create(input: CreateCategoryInput): Promise<Category>;
    update(id: number, input: CreateCategoryInput): Promise<Category>;
    delete(id: number): Promise<void>;
}

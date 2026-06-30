import { PaginationResponse } from '../../common/types/pagination.types';
import {
    Category,
    CreateCategoryInput,
    UpdateCategoryInput,
} from '../categories.types';

export const CATEGORIES_REPOSITORY = 'CATEGORIES_REPOSITORY';

export interface CategoriesRepository {
  findAll(page:number,limit:number): Promise<PaginationResponse<Category>>,
  findById(id: number): Promise<Category | null>;
  create(input: CreateCategoryInput): Promise<Category>;
  delete(id: number): Promise<void>;
}
import { PaginationResponse } from '../../common/types/pagination.types';
import { Category, CreateCategoryInput } from '../categories.types';
import { CategoriesRepository } from './categories.repository';

export class inMemoryCategoriesRepository implements CategoriesRepository {
    private categories: Category[] = [];

    async findAll(page:number,limit:number): Promise<PaginationResponse<Category>> {
        const offset = (page-1)*limit
        const data = this.categories.slice(offset,offset+limit)
        return {
            data,
            meta:{
                page,
                limit,
                total: this.categories.length,
                totalPages: Math.ceil(this.categories.length/limit)
            }
        }
    }

    async findById(id: number): Promise<Category | null>{
        const category = this.categories.find(e=>e.id===id);
        return category ? Promise.resolve(category) : Promise.resolve(null);
    }

    async findByName(name: string): Promise<Category | null> {
        const category = this.categories.find(e => e.name.toLowerCase() === name.toLowerCase());
        return category ? Promise.resolve(category) : Promise.resolve(null);
    }

    async create(input: CreateCategoryInput): Promise<Category> {
        const newCategory: Category = {
            id: this.categories.length + 1,
            name: input.name
        }
        this.categories.push(newCategory);
        return Promise.resolve(newCategory);
    }

    async update(id: number, input: CreateCategoryInput): Promise<Category | null> {
        const category = this.categories.find(e => e.id === id);
        if (!category) return null;
        category.name = input.name;
        return category;
    }

    async delete(id: number): Promise<void>{
        this.categories = this.categories.filter(e=>e.id!==id)
    }
}
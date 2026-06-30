import { of } from 'rxjs';
import { PaginationResponse } from '../../common/types/pagination.types';
import {
    Category,
    CreateCategoryInput,
    UpdateCategoryInput,
} from '../categories.types';
import { CategoriesRepository } from './categories.repository';
import { off } from 'process';

export class inMemoryCategoriesRepository implements CategoriesRepository {
    private categories: Category[] = [];
    private nextId = 1;

    async findAll(page:number,limit:number): Promise<PaginationResponse<Category>> {/*Echos por mi*/
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
        let category = this.categories.find(e=>e.id===id);
        return category ? Promise.resolve(category) : Promise.resolve(null);
    }

    async create(input: CreateCategoryInput): Promise<Category> {
        let newCategory: Category = {
            id:this.categories.length+1,
            name:input.name
        }
        this.categories.push(newCategory);
        return Promise.resolve(newCategory);
    }

    async delete(id: number): Promise<void>{
        this.categories = this.categories.filter(e=>e.id!==id)
        }

}
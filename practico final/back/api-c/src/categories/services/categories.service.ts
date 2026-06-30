import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Category,CreateCategoryInput,UpdateCategoryInput } from '../categories.types';

import { CATEGORIES_REPOSITORY, CategoriesRepository } from '../repositories/categories.repository';
import { PaginationResponse } from '../../common/types/pagination.types';

@Injectable()
export class CategoriesService {
    constructor(
        @Inject(CATEGORIES_REPOSITORY)
        private readonly categoriesRepository: CategoriesRepository,
    ) {}

    async findAll(page:number,limit:number): Promise<PaginationResponse<Category>> {
        page = page > 50 ? 50 : page<1 ? 1 : page
        return this.categoriesRepository.findAll(page,limit);
    }/*QUEDA MODIFICAR EL findAll de products*\ */

    async findById(id: number): Promise<Category | null>{
        const categoriById = await this.categoriesRepository.findById(id)
        if(!categoriById) throw new NotFoundException('404')
        return categoriById 
    }

    async create(input:CreateCategoryInput): Promise<Category> {
        return this.categoriesRepository.create(input)
    }

    async delete(id:number): Promise<void>{
        return this.categoriesRepository.delete(id)
    }




}
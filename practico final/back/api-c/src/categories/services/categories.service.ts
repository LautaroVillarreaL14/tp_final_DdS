import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Category, CreateCategoryInput } from '../categories.types';

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
    }

    async findById(id: number): Promise<Category | null>{
        const categoriById = await this.categoriesRepository.findById(id)
        if(!categoriById) throw new NotFoundException('Category not found')
        return categoriById 
    }

    async create(input:CreateCategoryInput): Promise<Category> {
        const existing = await this.categoriesRepository.findByName(input.name)
        if (existing) throw new ConflictException('Category already exists')
        return this.categoriesRepository.create(input)
    }

    async update(id:number, input:CreateCategoryInput): Promise<Category> {
        const existing = await this.categoriesRepository.findByName(input.name)
        if (existing && existing.id !== id) throw new ConflictException('Category already exists')
        const updated = await this.categoriesRepository.update(id, input)
        if (!updated) throw new NotFoundException('Category not found')
        return updated
    }

    async delete(id:number): Promise<void>{
        return this.categoriesRepository.delete(id)
    }




}
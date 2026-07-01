import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import {
    Category,
    CreateCategoryInput,
    UpdateCategoryInput
} from '../categories.types'
import { PaginationQuery, PaginationResponse } from '../../common/types/pagination.types';

@Controller('categories')
export class CategoriesController{
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 50): Promise<any> {
        const result = await this.categoriesService.findAll(page, limit);
        return result.data;
    }
    
    @Get(':id')
    finOne(@Param('id') id:string): Promise<Category | null>{
        return this.categoriesService.findById(+id)
    }

    @Post()
    crate(@Body() body:CreateCategoryInput):Promise<Category>{
        return this.categoriesService.create(body)
    }

    @Delete(':id')
    delete(@Param('id') id:string):Promise<void>{
        return this.categoriesService.delete(+id)
    }

}
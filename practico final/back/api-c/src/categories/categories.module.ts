import { Module } from '@nestjs/common';
import { Category} from './categories.types';    
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';
import { CATEGORIES_REPOSITORY } from './repositories/categories.repository';
import { inMemoryCategoriesRepository } from './repositories/in-memory-categories-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../products/product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ProductEntity])],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: CATEGORIES_REPOSITORY,
      useClass: inMemoryCategoriesRepository,
    },
  ],
})
export class CategoriesModule {}
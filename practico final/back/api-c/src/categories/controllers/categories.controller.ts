import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { Category, CreateCategoryInput } from '../categories.types';
import { AuthService } from '../../auth/auth.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async findAll(@Headers('authorization') auth?: string, @Query('page') page: number = 1, @Query('limit') limit: number = 50): Promise<any> {
    await this.requireUser(auth);
    const result = await this.categoriesService.findAll(page, limit);
    return result.data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Headers('authorization') auth?: string): Promise<Category | null> {
    await this.requireUser(auth);
    return this.categoriesService.findById(+id);
  }

  @Post()
  async create(@Body() body: CreateCategoryInput, @Headers('authorization') auth?: string): Promise<Category> {
    await this.requireAdmin(auth);
    return this.categoriesService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: CreateCategoryInput, @Headers('authorization') auth?: string): Promise<Category> {
    await this.requireAdmin(auth);
    return this.categoriesService.update(+id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Headers('authorization') auth?: string): Promise<void> {
    await this.requireAdmin(auth);
    return this.categoriesService.delete(+id);
  }

  private async requireUser(auth?: string) {
    const token = auth?.replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('Missing token');
    const user = await this.authService.meFromToken(token);
    if (!user) throw new UnauthorizedException('Invalid token');
    return user;
  }

  private async requireAdmin(auth?: string) {
    const user = await this.requireUser(auth);
    if (user.role !== 'admin') throw new ForbiddenException('Admin privilege required');
    return user;
  }
}
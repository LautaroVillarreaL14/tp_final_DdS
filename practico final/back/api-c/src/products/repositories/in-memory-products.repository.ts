import { PaginationQuery, PaginationResponse } from '../../common/types/pagination.types';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import { ProductsRepository } from './products.repository';

export class InMemoryProductsRepository implements ProductsRepository {
  private products: Product[] = [];
  private nextId = 1;

  async findAll(page:number,limit:number): Promise<PaginationResponse<Product>> {
    const offset = (page-1)*limit
    const data = this.products.slice(offset,offset+limit)
    return {
      data,
      meta : {
        page,
        limit,
        total : this.products.length,
        totalPages: data.length
      }
    }
  }

  async findById(id: number): Promise<Product | undefined> {
    return this.products.find((p) => p.id === id);
  }

  async create(input: CreateProductInput): Promise<Product> {
    const product: Product = {
      id: this.nextId++,
      name: input.name,
      price: input.price,
      stock: input.stock,
      categoryId: 0
    };

    this.products.push(product);
    return product;
  }

  async update(id: number, input: UpdateProductInput): Promise<Product | undefined> {
    const product = await this.findById(id);
    if (!product) return undefined;

    if (input.name !== undefined) product.name = input.name;
    if (input.price !== undefined) product.price = input.price;
    if (input.stock !== undefined) product.stock = input.stock;
    return product;
  }

  async remove(id: number): Promise<Product | undefined> {
    const product = this.findById(id);
    if (!product) return undefined;

    this.products = this.products.filter((p) => p.id !== id);
    return product;
  }

  async partialUpdate(id: number, data: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.find(e=>e.id===id);
    if (!product) return undefined;
    Object.assign(product, data);
    return product;
  }

  async updateStock(id: number, stock: number): Promise<Product | undefined> {
    const product = this.products.find(e=>e.id===id);
    if (!product) return undefined;
    product.stock = stock;
    return product;
  }
}


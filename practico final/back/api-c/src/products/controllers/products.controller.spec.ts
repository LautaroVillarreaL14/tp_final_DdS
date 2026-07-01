import { ProductsController } from './products.controller';
import { ProductsService } from '../services/products.service';

describe('ProductsController', () => {
  it('should return a frontend-friendly paginated response', async () => {
    const service = {
      findAll: jest.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Test product', price: 100, stock: 5, categoryId: 1, category: null }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      }),
    } as unknown as ProductsService;

    const controller = new ProductsController(service);
    const result = await controller.findAll(1, 10);

    expect(result).toEqual({
      items: [{ id: 1, name: 'Test product', price: 100, stock: 5, categoryId: 1, category: null }],
      total: 1,
      page: 1,
      limit: 10,
    });
  });
});

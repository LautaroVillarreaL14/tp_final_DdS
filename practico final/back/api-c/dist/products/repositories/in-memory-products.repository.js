"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryProductsRepository = void 0;
class InMemoryProductsRepository {
    products = [];
    nextId = 1;
    async findAll(page, limit) {
        const offset = (page - 1) * limit;
        const data = this.products.slice(offset, offset + limit);
        return {
            data,
            meta: {
                page,
                limit,
                total: this.products.length,
                totalPages: data.length
            }
        };
    }
    async findById(id) {
        return this.products.find((p) => p.id === id);
    }
    async create(input) {
        const product = {
            id: this.nextId++,
            name: input.name,
            price: input.price,
            stock: input.stock,
            categoryId: 0
        };
        this.products.push(product);
        return product;
    }
    async update(id, input) {
        const product = await this.findById(id);
        if (!product)
            return undefined;
        if (input.name !== undefined)
            product.name = input.name;
        if (input.price !== undefined)
            product.price = input.price;
        if (input.stock !== undefined)
            product.stock = input.stock;
        return product;
    }
    async remove(id) {
        const product = this.findById(id);
        if (!product)
            return undefined;
        this.products = this.products.filter((p) => p.id !== id);
        return product;
    }
    async partialUpdate(id, data) {
        const product = this.products.find(e => e.id === id);
        if (!product)
            return undefined;
        Object.assign(product, data);
        return product;
    }
    async updateStock(id, stock) {
        const product = this.products.find(e => e.id === id);
        if (!product)
            return undefined;
        product.stock = stock;
        return product;
    }
}
exports.InMemoryProductsRepository = InMemoryProductsRepository;
//# sourceMappingURL=in-memory-products.repository.js.map
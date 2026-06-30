"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inMemoryCategoriesRepository = void 0;
class inMemoryCategoriesRepository {
    categories = [];
    nextId = 1;
    async findAll(page, limit) {
        const offset = (page - 1) * limit;
        const data = this.categories.slice(offset, offset + limit);
        return {
            data,
            meta: {
                page,
                limit,
                total: this.categories.length,
                totalPages: Math.ceil(this.categories.length / limit)
            }
        };
    }
    async findById(id) {
        let category = this.categories.find(e => e.id === id);
        return category ? Promise.resolve(category) : Promise.resolve(null);
    }
    async create(input) {
        let newCategory = {
            id: this.categories.length + 1,
            name: input.name
        };
        this.categories.push(newCategory);
        return Promise.resolve(newCategory);
    }
    async delete(id) {
        this.categories = this.categories.filter(e => e.id !== id);
    }
}
exports.inMemoryCategoriesRepository = inMemoryCategoriesRepository;
//# sourceMappingURL=in-memory-categories-repository.js.map
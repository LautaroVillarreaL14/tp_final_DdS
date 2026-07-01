"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inMemoryCategoriesRepository = void 0;
class inMemoryCategoriesRepository {
    categories = [];
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
        const category = this.categories.find(e => e.id === id);
        return category ? Promise.resolve(category) : Promise.resolve(null);
    }
    async findByName(name) {
        const category = this.categories.find(e => e.name.toLowerCase() === name.toLowerCase());
        return category ? Promise.resolve(category) : Promise.resolve(null);
    }
    async create(input) {
        const newCategory = {
            id: this.categories.length + 1,
            name: input.name
        };
        this.categories.push(newCategory);
        return Promise.resolve(newCategory);
    }
    async update(id, input) {
        const category = this.categories.find(e => e.id === id);
        if (!category)
            return null;
        category.name = input.name;
        return category;
    }
    async delete(id) {
        this.categories = this.categories.filter(e => e.id !== id);
    }
}
exports.inMemoryCategoriesRepository = inMemoryCategoriesRepository;
//# sourceMappingURL=in-memory-categories-repository.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("../services/products.service");
const create_product_input_1 = require("../DTOs/create.product.input");
const update_product_input_1 = require("../DTOs/update.product.input");
const auth_service_1 = require("../../auth/auth.service");
let ProductsController = class ProductsController {
    productsService;
    authService;
    constructor(productsService, authService) {
        this.productsService = productsService;
        this.authService = authService;
    }
    async findAll(page = 1, limit = 50) {
        const result = await this.productsService.findAll(page, limit);
        return {
            items: result.data,
            total: result.meta.total,
            page: result.meta.page,
            limit: result.meta.limit,
        };
    }
    findOne(id) {
        return this.productsService.findOne(Number(id));
    }
    async create(body, auth) {
        await this.requireAdmin(auth);
        return this.productsService.create(body);
    }
    async update(id, body, auth) {
        await this.requireAdmin(auth);
        return this.productsService.update(Number(id), body);
    }
    async remove(id, auth) {
        await this.requireAdmin(auth);
        return this.productsService.remove(Number(id));
    }
    updateStock(id, stock) {
        return this.productsService.updateStock(id, stock);
    }
    async requireUser(auth) {
        const token = auth?.replace(/^Bearer\s+/i, '');
        if (!token)
            throw new common_1.UnauthorizedException('Missing token');
        const user = await this.authService.meFromToken(token);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid token');
        return user;
    }
    async requireAdmin(auth) {
        const user = await this.requireUser(auth);
        if (user.role !== 'admin')
            throw new common_1.ForbiddenException('Admin privilege required');
        return user;
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_input_1.CreateProductInput, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_input_1.UpdateProductInput, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/stock'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('stock')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateStock", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        auth_service_1.AuthService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map
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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("../services/categories.service");
const auth_service_1 = require("../../auth/auth.service");
let CategoriesController = class CategoriesController {
    categoriesService;
    authService;
    constructor(categoriesService, authService) {
        this.categoriesService = categoriesService;
        this.authService = authService;
    }
    async findAll(auth, page = 1, limit = 50) {
        await this.requireUser(auth);
        const result = await this.categoriesService.findAll(page, limit);
        return result.data;
    }
    async findOne(id, auth) {
        await this.requireUser(auth);
        return this.categoriesService.findById(+id);
    }
    async create(body, auth) {
        await this.requireAdmin(auth);
        return this.categoriesService.create(body);
    }
    async update(id, body, auth) {
        await this.requireAdmin(auth);
        return this.categoriesService.update(+id, body);
    }
    async delete(id, auth) {
        await this.requireAdmin(auth);
        return this.categoriesService.delete(+id);
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
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "delete", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService,
        auth_service_1.AuthService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map
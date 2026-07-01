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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../services/users.service");
const auth_service_1 = require("../../auth/auth.service");
const change_password_dto_1 = require("../dto/change-password.dto");
const change_email_dto_1 = require("../dto/change-email.dto");
const update_role_dto_1 = require("../dto/update-role.dto");
let UsersController = class UsersController {
    usersService;
    authService;
    constructor(usersService, authService) {
        this.usersService = usersService;
        this.authService = authService;
    }
    async findAll(auth) {
        const token = auth?.replace(/^Bearer\s+/i, '');
        if (!token)
            throw new common_1.UnauthorizedException('Missing token');
        const user = await this.authService.meFromToken(token);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid token');
        if (user.role !== 'admin')
            throw new common_1.ForbiddenException('Admin privilege required');
        return this.usersService.findAll();
    }
    async findOne(id) {
        const user = await this.usersService.findOne(+id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateRole(id, body, auth) {
        const token = auth?.replace(/^Bearer\s+/i, '');
        if (!token)
            throw new common_1.UnauthorizedException('Missing token');
        const user = await this.authService.meFromToken(token);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid token');
        if (user.role !== 'admin')
            throw new common_1.ForbiddenException('Admin privilege required');
        if (!['user', 'admin'].includes(body.role))
            throw new common_1.BadRequestException('Invalid role');
        if (+id === user.id)
            throw new common_1.ForbiddenException('Cannot change your own role');
        const updated = await this.usersService.updateRole(+id, body.role);
        if (!updated)
            throw new common_1.NotFoundException('User not found');
        return updated;
    }
    async changePassword(body, auth) {
        const token = auth?.replace(/^Bearer\s+/i, '');
        if (!token)
            throw new common_1.UnauthorizedException('Missing token');
        const user = await this.authService.meFromToken(token);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid token');
        const res = await this.usersService.changeMyPassword(user.id, body.currentPassword, body.newPassword);
        if (res === null)
            throw new common_1.BadRequestException('Current password invalid');
        return { message: 'Password updated' };
    }
    async changeEmail(body, auth) {
        const token = auth?.replace(/^Bearer\s+/i, '');
        if (!token)
            throw new common_1.UnauthorizedException('Missing token');
        const user = await this.authService.meFromToken(token);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid token');
        const res = await this.usersService.changeMyEmail(user.id, body.newEmail, body.password);
        if (res === null)
            throw new common_1.BadRequestException('Current password invalid');
        await this.authService.sendVerificationEmail(user.id, body.newEmail);
        return { message: 'Email updated' };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/role'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_role_dto_1.UpdateRoleDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Patch)('me/password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_password_dto_1.ChangePasswordDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Patch)('me/email'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_email_dto_1.ChangeEmailDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeEmail", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService, auth_service_1.AuthService])
], UsersController);
//# sourceMappingURL=users.controller.js.map
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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const verify_dto_1 = require("./dto/verify.dto");
const resend_dto_1 = require("./dto/resend.dto");
const forgot_dto_1 = require("./dto/forgot.dto");
const reset_dto_1 = require("./dto/reset.dto");
let AuthController = class AuthController {
    auth;
    constructor(auth) {
        this.auth = auth;
    }
    async register(body) {
        return this.auth.register(body.email, body.password);
    }
    async login(body) {
        return this.auth.login(body.email, body.password);
    }
    async me(auth) {
        const token = auth?.replace(/^Bearer\s+/i, '');
        if (!token)
            throw new common_1.UnauthorizedException('Missing token');
        return this.auth.meFromToken(token);
    }
    async verify(body) {
        return this.auth.verifyEmail(body.token);
    }
    async resend(body, auth) {
        const token = auth?.replace(/^Bearer\s+/i, '');
        if (token) {
            await this.auth.resendVerification(token);
            return { message: 'Email reenviado' };
        }
        if (body?.email) {
            await this.auth.resendVerification(body.email);
            return { message: 'Email reenviado' };
        }
        throw new common_1.UnauthorizedException('Missing token or email');
    }
    async requestReset(body) {
        await this.auth.requestPasswordReset(body.email);
        return { message: 'Si el email existe, recibirás un link' };
    }
    async reset(body) {
        await this.auth.resetPassword(body.token, body.password);
        return { message: 'Contraseña actualizada' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_dto_1.VerifyDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('resend-verification'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resend_dto_1.ResendDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resend", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_dto_1.ForgotDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestReset", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_dto_1.ResetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "reset", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map
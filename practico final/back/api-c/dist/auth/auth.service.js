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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer_service_1 = require("./mailer.service");
const crypto_1 = require("crypto");
const users_service_1 = require("../users/services/users.service");
let AuthService = class AuthService {
    usersService;
    mailer = new mailer_service_1.MailerService();
    jwtSecret = process.env.JWT_SECRET || 'changeme';
    constructor(usersService) {
        this.usersService = usersService;
    }
    async register(email, password) {
        const existing = await this.usersService.findByEmail(email);
        if (existing)
            throw new common_1.BadRequestException('Email already registered');
        const hashed = await bcrypt.hash(password, 10);
        const created = await this.usersService.create({ email, password: hashed, emailVerified: false });
        if (!created)
            throw new common_1.BadRequestException('Unable to create user');
        await this.sendVerificationEmail(created.id, created.email);
        const token = this.signToken(created.id);
        return { access_token: token, user: { id: created.id, email: created.email, emailVerified: created.emailVerified } };
    }
    safeUser(user) {
        const { password, ...rest } = user;
        return rest;
    }
    async login(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const ok = await bcrypt.compare(password, user.password || '');
        if (!ok)
            throw new common_1.BadRequestException('Invalid credentials');
        if (!user.emailVerified)
            throw new common_1.BadRequestException('Email not verified');
        const token = this.signToken(user.id);
        return { access_token: token, user: this.safeUser(user) };
    }
    signToken(userId) {
        return jwt.sign({ sub: userId }, this.jwtSecret, { expiresIn: '7d' });
    }
    async meFromToken(token) {
        try {
            const payload = jwt.verify(token, this.jwtSecret);
            const user = await this.usersService.findOne(payload.sub);
            if (!user)
                throw new common_1.NotFoundException('User not found');
            return this.safeUser(user);
        }
        catch (err) {
            throw new common_1.BadRequestException('Invalid token');
        }
    }
    async sendVerificationEmail(userId, email) {
        const token = (0, crypto_1.randomUUID)();
        const expiry = Date.now() + 1000 * 60 * 60 * 24;
        await this.usersService.update(userId, { verificationToken: token, isVerified: false });
        const link = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/verify-email?token=${token}`;
        const html = `Pulsa el enlace para verificar tu email: <a href="${link}">${link}</a>`;
        await this.mailer.sendMail(email, 'Verifica tu correo', html);
    }
    async verifyEmail(tokenStr) {
        const user = await this.usersService.findByVerificationToken(tokenStr);
        if (!user)
            throw new common_1.BadRequestException('Token inválido o expirado');
        await this.usersService.update(user.id, { isVerified: true, emailVerified: true, verificationToken: null });
        return { message: 'Email verificado correctamente' };
    }
    async resendVerification(tokenOrEmail) {
        if (tokenOrEmail && tokenOrEmail.includes && tokenOrEmail.includes('@')) {
            const userByEmail = await this.usersService.findByEmail(tokenOrEmail);
            if (!userByEmail)
                throw new common_1.NotFoundException('User not found');
            if (userByEmail.isVerified || userByEmail.emailVerified)
                throw new common_1.BadRequestException('Email already verified');
            await this.sendVerificationEmail(userByEmail.id, userByEmail.email);
            return;
        }
        const user = await this.meFromToken(tokenOrEmail);
        if (!user)
            throw new common_1.BadRequestException('Usuario inválido');
        if (user.isVerified || user.emailVerified)
            throw new common_1.BadRequestException('Email already verified');
        await this.sendVerificationEmail(user.id, user.email);
    }
    async requestPasswordReset(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return;
        const token = (0, crypto_1.randomUUID)();
        const expiry = Date.now() + 1000 * 60 * 60;
        await this.usersService.update(user.id, { resetPasswordToken: token, resetPasswordExpires: expiry });
        const link = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/reset-password?token=${token}`;
        const html = `Pulsa para resetear tu contraseña: <a href="${link}">${link}</a>`;
        await this.mailer.sendMail(user.email, 'Resetear contraseña', html);
    }
    async resetPassword(tokenStr, newPassword) {
        const user = await this.usersService.findByResetToken(tokenStr);
        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < Date.now())
            throw new common_1.BadRequestException('Token inválido o expirado');
        const hashed = await bcrypt.hash(newPassword, 10);
        await this.usersService.update(user.id, { password: hashed, resetPasswordToken: null, resetPasswordExpires: null });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
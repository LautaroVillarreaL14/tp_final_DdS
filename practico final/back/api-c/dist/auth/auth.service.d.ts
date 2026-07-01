import { UsersService } from '../users/services/users.service';
export declare class AuthService {
    private usersService;
    private mailer;
    private jwtSecret;
    constructor(usersService: UsersService);
    register(email: string, password: string): Promise<{
        access_token: any;
        user: any;
    }>;
    private safeUser;
    login(email: string, password: string): Promise<{
        access_token: any;
        user: any;
    }>;
    signToken(userId: number): any;
    meFromToken(token: string): Promise<any>;
    sendVerificationEmail(userId: number, email: string): Promise<void>;
    verifyEmail(tokenStr: string): Promise<{
        message: string;
    }>;
    resendVerification(tokenOrEmail: string): Promise<void>;
    requestPasswordReset(email: string): Promise<void>;
    resetPassword(tokenStr: string, newPassword: string): Promise<void>;
}

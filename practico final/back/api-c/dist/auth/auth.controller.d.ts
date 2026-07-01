import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { ResendDto } from './dto/resend.dto';
import { ForgotDto } from './dto/forgot.dto';
import { ResetDto } from './dto/reset.dto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(body: RegisterDto): Promise<{
        access_token: any;
        user: any;
    }>;
    login(body: LoginDto): Promise<{
        access_token: any;
        user: any;
    }>;
    me(auth?: string): Promise<any>;
    verify(body: VerifyDto): Promise<{
        message: string;
    }>;
    resend(body: ResendDto, auth?: string): Promise<{
        message: string;
    }>;
    requestReset(body: ForgotDto): Promise<{
        message: string;
    }>;
    reset(body: ResetDto): Promise<{
        message: string;
    }>;
}

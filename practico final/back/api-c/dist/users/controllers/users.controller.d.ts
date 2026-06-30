import { ExternalUser } from '../user.types';
import { UsersService } from '../services/users.service';
import { AuthService } from '../../auth/auth.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ChangeEmailDto } from '../dto/change-email.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly authService;
    constructor(usersService: UsersService, authService: AuthService);
    findAll(): Promise<ExternalUser[]>;
    findOne(id: string): Promise<ExternalUser>;
    changePassword(body: ChangePasswordDto, auth?: string): Promise<{
        message: string;
    }>;
    changeEmail(body: ChangeEmailDto, auth?: string): Promise<{
        message: string;
    }>;
}

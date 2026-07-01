import { ExternalUser } from '../user.types';
import { UsersService } from '../services/users.service';
import { AuthService } from '../../auth/auth.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ChangeEmailDto } from '../dto/change-email.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly authService;
    constructor(usersService: UsersService, authService: AuthService);
    findAll(auth?: string): Promise<ExternalUser[]>;
    findOne(id: string): Promise<ExternalUser>;
    updateRole(id: string, body: UpdateRoleDto, auth?: string): Promise<any>;
    changePassword(body: ChangePasswordDto, auth?: string): Promise<{
        message: string;
    }>;
    changeEmail(body: ChangeEmailDto, auth?: string): Promise<{
        message: string;
    }>;
}

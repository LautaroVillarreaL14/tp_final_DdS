import { ExternalUser } from '../user.types';
import { UsersGateway } from '../gateways/users.gateway';
export declare class UsersService {
    private readonly usersGateway;
    constructor(usersGateway: UsersGateway);
    findAll(): Promise<ExternalUser[]>;
    findOne(id: number): Promise<ExternalUser | undefined>;
    findByEmail(email: string): Promise<any>;
    findByVerificationToken(token: string): Promise<any>;
    findByResetToken(token: string): Promise<any>;
    create(data: Partial<ExternalUser>): Promise<any>;
    update(id: string | number, data: Partial<ExternalUser>): Promise<any>;
    updateRole(userId: number, role: string): Promise<any>;
    changeMyPassword(userId: number, currentPassword: string, newPassword: string): Promise<any>;
    changeMyEmail(userId: number, newEmail: string, password: string): Promise<any>;
}

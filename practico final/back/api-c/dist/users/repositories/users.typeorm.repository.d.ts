import { Repository } from 'typeorm';
import { UsersGateway } from '../gateways/users.gateway';
import { UserEntity } from '../entities/user.entity';
import { ExternalUser } from '../user.types';
export declare class UsersTypeOrmRepository implements UsersGateway {
    private repo;
    constructor(repo: Repository<UserEntity>);
    private safeUser;
    fetchAll(): Promise<ExternalUser[]>;
    findOne(id: number): Promise<ExternalUser | undefined>;
    findByEmail(email: string): Promise<any>;
    findByVerificationToken(token: string): Promise<any>;
    findByResetToken(token: string): Promise<any>;
    create(data: Partial<ExternalUser>): Promise<any>;
    update(id: string | number, data: Partial<ExternalUser>): Promise<ExternalUser | undefined>;
}

import { ExternalUser } from '../user.types';

export const USERS_GATEWAY = 'USERS_GATEWAY';

export interface UsersGateway {
  fetchAll(): Promise<ExternalUser[]>;
  findOne(id: number): Promise<ExternalUser>;
  findByEmail?(email: string): Promise<ExternalUser | undefined> | ExternalUser | undefined;
  findByVerificationToken?(token: string): Promise<ExternalUser | undefined> | ExternalUser | undefined;
  findByResetToken?(token: string): Promise<ExternalUser | undefined> | ExternalUser | undefined;
  create?(data: Partial<ExternalUser>): Promise<ExternalUser> | ExternalUser;
  update?(id: string | number, data: Partial<ExternalUser>): Promise<ExternalUser> | ExternalUser;
}


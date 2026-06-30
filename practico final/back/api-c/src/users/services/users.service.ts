import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ExternalUser } from '../user.types';
import { USERS_GATEWAY, UsersGateway } from '../gateways/users.gateway';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_GATEWAY)
    private readonly usersGateway: UsersGateway,
  ) {}

  async findAll(): Promise<ExternalUser[]> {
    try {
      return await this.usersGateway.fetchAll();
    } catch {
      throw new BadGatewayException('Upstream users service failed');
    }
  }

  async findOne(id: number) : Promise<ExternalUser>{
    return await this.usersGateway.findOne(id) 
  }

  async findByEmail(email: string) {
    // delegate; may be sync or async
    // @ts-ignore
    return await (this.usersGateway.findByEmail ? this.usersGateway.findByEmail(email) : undefined) as any;
  }

  async findByVerificationToken(token: string) {
    // @ts-ignore
    return await (this.usersGateway.findByVerificationToken ? this.usersGateway.findByVerificationToken(token) : undefined) as any;
  }

  async findByResetToken(token: string) {
    // @ts-ignore
    return await (this.usersGateway.findByResetToken ? this.usersGateway.findByResetToken(token) : undefined) as any;
  }

  async create(data: Partial<ExternalUser>) {
    // @ts-ignore
    return await (this.usersGateway.create ? this.usersGateway.create(data) : undefined) as any;
  }

  async update(id: string | number, data: Partial<ExternalUser>) {
    // @ts-ignore
    return await (this.usersGateway.update ? this.usersGateway.update(id, data) : undefined) as any;
  }

  async changeMyPassword(userId: number, currentPassword: string, newPassword: string) {
    // @ts-ignore
    const user = await (this.usersGateway.findOne ? this.usersGateway.findOne(userId) : undefined) as any;
    if (!user) return undefined;
    const bcrypt = require('bcrypt');
    const ok = await bcrypt.compare(currentPassword, user.password || '');
    if (!ok) return null;
    const hashed = await bcrypt.hash(newPassword, 10);
    return await (this.usersGateway.update ? this.usersGateway.update(userId, { password: hashed }) : undefined) as any;
  }

  async changeMyEmail(userId: number, newEmail: string, password: string) {
    // @ts-ignore
    const user = await (this.usersGateway.findOne ? this.usersGateway.findOne(userId) : undefined) as any;
    if (!user) return undefined;
    const bcrypt = require('bcrypt');
    const ok = await bcrypt.compare(password, user.password || '');
    if (!ok) return null;
    return await (this.usersGateway.update ? this.usersGateway.update(userId, { email: newEmail, isVerified: false, verificationToken: null }) : undefined) as any;
  }
}


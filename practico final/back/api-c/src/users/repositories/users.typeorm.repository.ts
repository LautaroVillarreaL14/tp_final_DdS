import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersGateway } from '../gateways/users.gateway';
import { UserEntity } from '../entities/user.entity';
import { ExternalUser } from '../user.types';

@Injectable()
export class UsersTypeOrmRepository implements UsersGateway {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
  ) {}

  private safeUser(user: ExternalUser): ExternalUser {
    const { password, verificationToken, verificationTokenExpires, resetPasswordToken, resetPasswordExpires, ...rest } = user as any;
    return rest as ExternalUser;
  }

  async fetchAll(): Promise<ExternalUser[]> {
    const users = await this.repo.find();
    return users.map((user) => this.safeUser(user as any));
  }

  async findOne(id: number): Promise<ExternalUser | undefined> {
    const user = (await this.repo.findOneBy({ id: Number(id) })) as any;
    return user ? this.safeUser(user) : undefined;
  }

  async findByEmail(email: string) {
    return (await this.repo.findOne({ where: { email } })) as any;
  }

  async findByVerificationToken(token: string) {
    return (await this.repo.findOne({ where: { verificationToken: token } })) as any;
  }

  async findByResetToken(token: string) {
    return (await this.repo.findOne({ where: { resetPasswordToken: token } })) as any;
  }

  async create(data: Partial<ExternalUser>) {
    const ent = this.repo.create(data as any);
    return (await this.repo.save(ent)) as any;
  }

  async update(id: string | number, data: Partial<ExternalUser>): Promise<ExternalUser | undefined> {
    await this.repo.update(Number(id), data as any);
    const user = (await this.repo.findOneBy({ id: Number(id) })) as any;
    return user ? this.safeUser(user) : undefined;
  }
}

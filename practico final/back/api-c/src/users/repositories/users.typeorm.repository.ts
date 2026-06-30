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

  async fetchAll(): Promise<ExternalUser[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<ExternalUser> {
    return (await this.repo.findOneBy({ id: Number(id) })) as any;
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

  async update(id: string | number, data: Partial<ExternalUser>) {
    await this.repo.update(Number(id), data as any);
    return (await this.repo.findOneBy({ id: Number(id) })) as any;
  }
}

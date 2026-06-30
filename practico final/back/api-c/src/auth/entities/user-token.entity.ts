import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_token' })
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  type: string; // 'verify' | 'reset'

  @Column()
  userId: number;

  @Column('bigint')
  expiresAt: number;
}

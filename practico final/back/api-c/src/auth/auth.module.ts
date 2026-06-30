import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthUser } from './entities/auth-user.entity';
import { UserToken } from './entities/user-token.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AuthUser, UserToken])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

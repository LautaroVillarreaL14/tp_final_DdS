import { Controller, Get, Param, Patch, Body, Headers, NotFoundException, BadRequestException } from '@nestjs/common';
import { ExternalUser } from '../user.types';
import { UsersService } from '../services/users.service';
import { UsersGateway } from '../gateways/users.gateway';
import { AuthService } from '../../auth/auth.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ChangeEmailDto } from '../dto/change-email.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

  @Get()
  findAll(): Promise<ExternalUser[]> {
    return this.usersService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ExternalUser>{
    return await this.usersService.findOne(+id)

  }

  @Patch('me/password')
  async changePassword(@Body() body: ChangePasswordDto, @Headers('authorization') auth?: string) {
    const token = auth?.replace(/^Bearer\s+/i, '');
    if (!token) throw new BadRequestException('Missing token');
    const user = await this.authService.meFromToken(token);
    if (!user) throw new NotFoundException('User not found');
    const res = await this.usersService.changeMyPassword(user.id, body.currentPassword, body.newPassword);
    if (res === null) throw new BadRequestException('Current password invalid');
    return { message: 'Password updated' };
  }

  @Patch('me/email')
  async changeEmail(@Body() body: ChangeEmailDto, @Headers('authorization') auth?: string) {
    const token = auth?.replace(/^Bearer\s+/i, '');
    if (!token) throw new BadRequestException('Missing token');
    const user = await this.authService.meFromToken(token);
    if (!user) throw new NotFoundException('User not found');
    const res = await this.usersService.changeMyEmail(user.id, body.newEmail, body.password);
    if (res === null) throw new BadRequestException('Current password invalid');
    // send verification email to new address
    await this.authService.sendVerificationEmail(user.id, body.newEmail);
    return { message: 'Email updated' };
  }
}

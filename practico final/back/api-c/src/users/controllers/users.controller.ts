import { Controller, Get, Param, Patch, Body, Headers, NotFoundException, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ExternalUser } from '../user.types';
import { UsersService } from '../services/users.service';
import { AuthService } from '../../auth/auth.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ChangeEmailDto } from '../dto/change-email.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

  @Get()
  async findAll(@Headers('authorization') auth?: string): Promise<ExternalUser[]> {
    const token = auth?.replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('Missing token');
    const user = await this.authService.meFromToken(token);
    if (!user) throw new UnauthorizedException('Invalid token');
    if (user.role !== 'admin') throw new ForbiddenException('Admin privilege required');
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ExternalUser> {
    const user = await this.usersService.findOne(+id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Patch(':id/role')
  async updateRole(@Param('id') id: string, @Body() body: UpdateRoleDto, @Headers('authorization') auth?: string) {
    const token = auth?.replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('Missing token');
    const user = await this.authService.meFromToken(token);
    if (!user) throw new UnauthorizedException('Invalid token');
    if (user.role !== 'admin') throw new ForbiddenException('Admin privilege required');
    if (!['user', 'admin'].includes(body.role)) throw new BadRequestException('Invalid role');
    if (+id === user.id) throw new ForbiddenException('Cannot change your own role');

    const updated = await this.usersService.updateRole(+id, body.role);
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  @Patch('me/password')
  async changePassword(@Body() body: ChangePasswordDto, @Headers('authorization') auth?: string) {
    const token = auth?.replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('Missing token');
    const user = await this.authService.meFromToken(token);
    if (!user) throw new UnauthorizedException('Invalid token');
    const res = await this.usersService.changeMyPassword(user.id, body.currentPassword, body.newPassword);
    if (res === null) throw new BadRequestException('Current password invalid');
    return { message: 'Password updated' };
  }

  @Patch('me/email')
  async changeEmail(@Body() body: ChangeEmailDto, @Headers('authorization') auth?: string) {
    const token = auth?.replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('Missing token');
    const user = await this.authService.meFromToken(token);
    if (!user) throw new UnauthorizedException('Invalid token');
    const res = await this.usersService.changeMyEmail(user.id, body.newEmail, body.password);
    if (res === null) throw new BadRequestException('Current password invalid');
    // send verification email to new address
    await this.authService.sendVerificationEmail(user.id, body.newEmail);
    return { message: 'Email updated' };
  }
}

import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ResendDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  token?: string;
}

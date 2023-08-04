import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MinLength, IsBoolean, IsOptional } from 'class-validator'

export default class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @IsOptional()
  firstName?: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @IsOptional()
  lastName?: string

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isTwoFa?: boolean

  @ApiProperty()
  @IsOptional()
  twoFaHash: string | null
}

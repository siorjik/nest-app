import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MinLength, IsBoolean, IsOptional } from 'class-validator'

export default class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  firstName: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  lastName: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsOptional()
  isActive?: boolean
}

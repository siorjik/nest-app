import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, IsOptional } from 'class-validator'

export default class LoginDto {
  @ApiProperty()
  @IsString()
  password: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  code?: string
}

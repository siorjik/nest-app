import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export default class ResetTwoFaEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  password: string
}

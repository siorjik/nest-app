import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail } from 'class-validator'

export default class SendEmailDto {
  @ApiProperty()
  @IsString()
  subject: string

  @ApiProperty()
  @IsEmail()
  to: string
  
  @ApiProperty()
  @IsString()
  html: string
}

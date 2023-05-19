import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MinLength } from 'class-validator'

export default class CreateUserDto {
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
}

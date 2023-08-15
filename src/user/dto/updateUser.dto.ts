import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MinLength, IsBoolean, IsOptional } from 'class-validator'

export default class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @MinLength(1)
  @IsOptional()
  firstName?: string

  @ApiProperty({ required: false })
  @IsString()
  @MinLength(1)
  @IsOptional()
  lastName?: string

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isTwoFa?: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  twoFaHash?: string | null
}

import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MinLength, IsBoolean, IsNumber, IsOptional } from 'class-validator'

export default class ReturnUserDto {
  @ApiProperty()
  @IsNumber()
  id: number

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
  @IsBoolean()
  isActive: boolean

  @ApiProperty()
  @IsBoolean()
  isTwoFa: boolean

  @ApiProperty()
  @IsString()
  twoFaHash: string | null

  @ApiProperty()
  @IsString()
  createdAt: string

  @ApiProperty()
  @IsString()
  updatedAt: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  refreshToken?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  accessToken?: string
}

import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export default class BadRequestDto {
  @ApiProperty()
  @IsString()
  error: string

  @ApiProperty()
  @IsString()
  statusCode: number

  @ApiProperty()
  @IsString()
  message: string
}
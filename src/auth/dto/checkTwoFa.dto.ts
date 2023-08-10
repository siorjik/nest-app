import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export default class CheckTwoFaDto {
  @ApiProperty()
  @IsString()
  email: string
}

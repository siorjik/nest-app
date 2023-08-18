import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export default class ResetTwoFaDto {
  @ApiProperty()
  @IsString()
  token: string
}

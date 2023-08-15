import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export default class ConfirmTwoFaDto {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  code: string
}

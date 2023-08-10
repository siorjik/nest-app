import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export default class ReturnCheckTwoFaDto {
  @ApiProperty()
  @IsBoolean()
  isTwoFa: boolean
}

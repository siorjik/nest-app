import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export default class ReturnRefreshDto {
  @ApiProperty()
  @IsString()
  accessToken: string

  @ApiProperty()
  @IsString()
  refreshToken: string
}
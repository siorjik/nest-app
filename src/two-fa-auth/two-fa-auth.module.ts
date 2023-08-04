import { Module } from '@nestjs/common'
import TwoFaAuthService from './two-fa-auth.service'

@Module({
  providers: [TwoFaAuthService],
  exports: [TwoFaAuthService]
})
export default class TwoFaAuthModule {}

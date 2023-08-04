import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import AuthController from './auth.controller'
import AuthService from './auth.service'
import JwtStrategy from './auth.strategy'
import User from '../user/user.entity'
import TokenModule from '../token/token.module'
import LoggerModule from '../logger/logger.module'
import TwoFaAuthModule from '../two-fa-auth/two-fa-auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), TokenModule, LoggerModule, TwoFaAuthModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})

export default class AuthModule {}

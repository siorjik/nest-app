import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import AuthController from './auth.controller'
import AuthService from './auth.service'
import JwtStrategy from './auth.strategy'
import User from '../user/user.entity'
import TokenModule from '../token/token.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), TokenModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})

export default class AuthModule {}

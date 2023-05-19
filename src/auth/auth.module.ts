import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import AuthController from './auth.controller'
import AuthService from './auth.service'
import User from 'src/user/user.entity'
import { TokenModule } from 'src/token/token.module'
import JwtStrategy from './auth.strategy'

@Module({
  imports: [TypeOrmModule.forFeature([User]), TokenModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})

export default class AuthModule {}

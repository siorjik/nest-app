import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import TokenService from './token.service'
import Token from './token.entity'
import User from '../user/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Token, User])],
  providers: [TokenService, JwtService],
  exports: [TokenService]
})
export default class TokenModule {}

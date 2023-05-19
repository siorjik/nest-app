import { Module } from '@nestjs/common'
import { TokenService } from './token.service'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import Token from './token.entity'
import User from 'src/user/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Token, User])],
  providers: [TokenService, JwtService],
  exports: [TokenService]
})
export class TokenModule {}

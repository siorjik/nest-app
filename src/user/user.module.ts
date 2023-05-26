import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import UserController from './user.controller'
import UserService from './user.service'
import User from './user.entity'
import MailerModule from '../mailer/mailer.module'
import TokenModule from '../token/token.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailerModule, TokenModule],
  controllers: [UserController],
  providers: [UserService]
})

export default class UserModule {}

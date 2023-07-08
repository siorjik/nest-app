import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import UserController from './user.controller'
import UserService from './user.service'
import User from './user.entity'
import MailerModule from '../mailer/mailer.module'
import TokenModule from '../token/token.module'
import { QueueModule } from 'src/queue/queue.module'
import { UserConsumer } from './user.consumer'
import LoggerModule from '../logger/logger.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailerModule, TokenModule, QueueModule, LoggerModule],
  controllers: [UserController],
  providers: [UserService, UserConsumer]
})

export default class UserModule {}

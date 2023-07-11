import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'

import { UserConsumer } from './user.consumer'
import UserModule from '../user/user.module'
import LoggerModule from '../logger/logger.module'
import SocketModule from '../socket/socket.module'

const queue = BullModule.registerQueue({ name: 'user' })

@Module({
  imports: [
    SocketModule,
    UserModule,
    LoggerModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
    }),
    queue
  ],
  exports: [queue],
  providers: [UserConsumer]
})

export default class QueueModule {}

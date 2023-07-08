import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'

const queue = BullModule.registerQueue({ name: 'user' })

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
    }),
    queue
  ],
  exports: [queue]
})

export class QueueModule {}

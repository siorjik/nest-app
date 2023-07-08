import { MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

import UserModule from './user/user.module'
import { dataSourceOptions } from '../db/data-source'
import { QueueModule } from './queue/queue.module'
import LoggerModule from './logger/logger.module'
import TokenModule from './token/token.module'
import MailerModule from './mailer/mailer.module'
import AuthModule from './auth/auth.module'
import LoggerMiddleware from './logger/logger.middleware'

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    TokenModule,
    MailerModule,
    LoggerModule,
    QueueModule,
  ],
  controllers: [],
  providers: []
})

export class AppModule {
  constructor(@InjectQueue('user') private userQueue: Queue) {
    this.deleteInactiveUsers()
  }

  async deleteInactiveUsers() {
    await this.userQueue.add('inactive-users-checking-job',
      { job: 'checking inactive users' },
      //{ repeat: { every: 2000, limit: 2 }, removeOnComplete: true }
      { repeat: { cron: '30 06,18 * * *' } }
    )
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}

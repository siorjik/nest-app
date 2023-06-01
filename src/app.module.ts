import { MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import UserModule from './user/user.module'
import { dataSourceOptions } from '../db/data-source'
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
  ],
  controllers: [],
  providers: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}

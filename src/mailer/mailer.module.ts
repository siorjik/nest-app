import { Module } from '@nestjs/common'
import { MailerModule as MailModule } from '@nestjs-modules/mailer'
import { config } from 'dotenv'

import MailerService from './mailer.service'

config({ path: `.env.${process.env.NODE_ENV}` })

@Module({
  imports: [
    MailModule.forRoot({
      transport: {
        host: process.env.MAILER_HOST,
        port: +process.env.MAILER_PORT,
        secure: true,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS,
        }
      }
    }),
  ],
  providers: [MailerService],
  exports: [MailerService]
})

export default class MailerModule {}

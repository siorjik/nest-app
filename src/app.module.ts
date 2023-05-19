import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import UserModule from './user/user.module'
import { dataSourceOptions } from '../db/data-source'
import { TokenModule } from './token/token.module'
import AuthModule from './auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    TokenModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule {}

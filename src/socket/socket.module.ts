import { Module } from '@nestjs/common'

import UserGateway from './user.gateway'
import LoggerModule from '../logger/logger.module'

@Module({
  imports: [LoggerModule],
  exports: [UserGateway],
  providers: [UserGateway]
})

export default class SocketModule {}

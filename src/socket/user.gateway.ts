import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Server } from 'http'

import LoggerService from '../logger/logger.service'

@WebSocketGateway({ cors: { origin: process.env.CLIENT_HOST, credentials: true } })
export default class UserGateway implements OnGatewayInit {
  @WebSocketServer() socket: Server
  private context = 'UserGateway'

  constructor(private readonly loggerService: LoggerService) {}

  afterInit() {
    this.loggerService.log('Socket connection initialized', this.context)
  }
}

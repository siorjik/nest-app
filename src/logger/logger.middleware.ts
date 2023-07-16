import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export default class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP')

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request

    response.on('finish', () => {
      const { statusCode } = response
      const logString = `${method} ${originalUrl} - ${statusCode}`

      if (String(statusCode)[0] !== '4' && String(statusCode)[0] !== '5') this.logger.log(logString)
      else this.logger.error(logString)
    })

    next()
  }
}
import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export default class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP')

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request

    response.on('finish', () => {
      const { statusCode } = response

      if (statusCode !== 400 && statusCode !== 401) this.logger.log(`${method} ${originalUrl} - ${statusCode}`)
      else this.logger.error(`${method} ${originalUrl} - ${statusCode}`)
    })

    next()
  }
}
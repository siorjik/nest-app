import { Injectable, Logger } from '@nestjs/common'

type DataType = { [k: string]: string | number | boolean } | string

@Injectable()
export default class LoggerService {
  constructor(private readonly logger: Logger) { }

  log(data: DataType, context: string) {
    this.logger.log(data, context)
  }

  error(data: DataType, context: string) {
    this.logger.error(data, context)
  }
}

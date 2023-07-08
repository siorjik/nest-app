import { Processor, Process, InjectQueue, OnQueueCompleted, OnQueueFailed, OnQueueError } from '@nestjs/bull'
import { InjectRepository } from '@nestjs/typeorm'
import { Job, Queue } from 'bull'
import { Repository } from 'typeorm'

import User from './user.entity'
import LoggerService from '../logger/logger.service'

@Processor('user')
export class UserConsumer {
  private readonly context = 'UserConsumer'

  constructor(
    @InjectQueue('user') private userQueue: Queue,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly loggerService: LoggerService,
  ) { }

  async deleteInactiveUsers() {
    const users = await this.userRepository.find({ where: { isActive: false } })
    const result = []

    users.forEach(async (user) => {
      if (new Date().getTime() - new Date(user.createdAt).getTime() > 1000 * 60 * 30) {
        result.push(user.email)

        await this.userRepository.delete({ id: user.id })
      }
    })

    return result
  }

  @Process('inactive-users-checking-job')
  async process(job: Job) {
    const deletedInactiveUsers = await this.deleteInactiveUsers()
    //await this.userQueue.obliterate({ force: true })
    job.data = { ...job.data as object, deletedInactiveUsers }
  }

  @OnQueueCompleted()
  async completed(job: Job) {
    this.loggerService.warn(JSON.stringify(job.data), this.context)
  }

  @OnQueueFailed()
  async failed(job: Job, err: Error) {
    this.loggerService.error(`Failed - ${job.name}: ${err.message}`, this.context)
  }

  @OnQueueError()
  async error(err: Error) {
    this.loggerService.error(`Error: ${err.message}`, this.context)
  }
}

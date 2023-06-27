import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import User from '../user/user.entity'
import LoginDto from './dto/login.dto'
import TokenService from '../token/token.service'
import LoggerService from '../logger/logger.service'

@Injectable()
export default class AuthService {
  private readonly context = 'AuthService'

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly loggerService: LoggerService
  ) { }

  async login(data: LoginDto): Promise<User | boolean> {
    const user = await this.userRepository.findOneBy({ email: data.email })
    
    if (user && user.password) {
      const isValidPass = await bcrypt.compare(data.password, user.password)
      
      if (isValidPass) {
        const tokens = await this.tokenService.generateTokens({ id: user.id, email: user.email })
        
        delete user.password

        this.loggerService.log(`login with: ${data.email}`, this.context)

        return { ...user, ...tokens }
      }
      else {
        this.loggerService.error('invalid password', this.context)

        return false
      }
    } else {
      this.loggerService.error('invalid credentials', this.context)

      return false
    }
  }

  async refresh(token: string): Promise<{ accessToken: string, refreshToken: string }> {
    return this.tokenService.verifyRefresh(token)
  }

  async logout(token: string) {
    return await this.tokenService.removeToken(token)
  }
}

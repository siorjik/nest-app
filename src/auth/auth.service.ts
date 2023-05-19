import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import User from '../user/user.entity'
import LoginDto from './dto/login.dto'
import { TokenService } from '../token/token.service'

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService
  ) {}

  async login (data: LoginDto): Promise<{ user: User & { token: string }, refresh: string } | boolean> {
    const user = await this.userRepository.findOneBy({ email: data.email })

    if (user && user.password) {
      const isValidPass = await bcrypt.compare(data.password, user.password)

      if (isValidPass) {
        const tokens = await this.tokenService.generateTokens({ id: user.id, email: user.email })

        delete user.password

        return {
          user: { ...user, token: tokens.accessToken },
          refresh: tokens.refreshToken,
        }
      }
      else return false
    } else return false
  }

  async refresh (token: string): Promise<{ accessToken: string, refreshToken: string }> {
    return this.tokenService.verifyToken(token)
  }

  async logout(token: string) {
    return await this.tokenService.removeToken(token)
  }
}

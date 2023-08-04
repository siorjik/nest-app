import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import User from '../user/user.entity'
import LoginDto from './dto/login.dto'
import TokenService from '../token/token.service'
import LoggerService from '../logger/logger.service'
import TwoFaAuthService from '../two-fa-auth/two-fa-auth.service'

@Injectable()
export default class AuthService {
  private readonly context = 'AuthService'

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly loggerService: LoggerService,
    private readonly twoFaAuthService: TwoFaAuthService
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

  async createTwoFa(id: number) {
    try {
      const twoFa = this.twoFaAuthService.generate()
      const qrCodeUrl = this.twoFaAuthService.generateQRUrl(twoFa.base32)

      await this.userRepository.update({ id }, { twoFaHash: twoFa.base32 })

      return { qrCodeUrl }
    } catch (error) {
      throw new BadRequestException('Error with QR code creating...')
    }
  }

  async confirmTwoFa(id: number, code: string) {
    try {
      const user = await this.userRepository.findOneBy({ id })
  
      const isVerified = this.twoFaAuthService.verify(code, user.twoFaHash)
  
      if (isVerified) await this.userRepository.update({ id }, { isTwoFa: true })
      else throw new Error()
      
      return await this.userRepository.findOneBy({ id })
    } catch (error) {
      throw new BadRequestException('Invalid code...')
    }

  }
}

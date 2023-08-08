import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as speakeasy from 'speakeasy'

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

  async createTwoFa(id: number) {
    try {
      const twoFa = speakeasy.generateSecret()
      const qrCodeUrl = speakeasy.otpauthURL({ secret: twoFa.base32, label: 'Label', issuer: 'Issuer', encoding: 'base32' })

      await this.userRepository.update({ id }, { twoFaHash: twoFa.base32 })

      return { qrCodeUrl }
    } catch (error) {
      throw new BadRequestException('Error with QR code creating...')
    }
  }

  async confirmTwoFa(id: number, token: string) {
    try {
      const user = await this.userRepository.findOneBy({ id })
  
      const isVerified = speakeasy.totp.verify({ secret: user.twoFaHash, encoding: 'base32', token })
  
      if (isVerified) await this.userRepository.update({ id }, { isTwoFa: true })
      else throw new Error()
      
      return await this.userRepository.findOneBy({ id })
    } catch (error) {
      throw new BadRequestException('Invalid code...')
    }

  }
}

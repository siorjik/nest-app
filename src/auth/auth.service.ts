import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as speakeasy from 'speakeasy'

import User from '../user/user.entity'
import LoginDto from './dto/login.dto'
import TokenService from '../token/token.service'
import LoggerService from '../logger/logger.service'
import MailerService from '../mailer/mailer.service'

@Injectable()
export default class AuthService {
  private readonly context = 'AuthService'

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly loggerService: LoggerService,
    private readonly mailerService: MailerService
  ) { }

  async checkTwoFa(email: string): Promise<{ isTwoFa: boolean }> {
    const user = await this.userRepository.findOneBy({ email })

    if (!user) throw new UnauthorizedException('Invalid credentials')

    return { isTwoFa: user.isTwoFa }
  }

  async login(data: LoginDto): Promise<User | boolean> {
    const user = await this.userRepository.findOneBy({ email: data.email })

    if (user && user.password) {
      const isValidPass = await bcrypt.compare(data.password, user.password)
      const isValidTwoFa = data.code ?
        speakeasy.totp.verify({ secret: user.twoFaHash, encoding: 'base32', token: data.code }) : true

      if (isValidPass && isValidTwoFa) {
        const tokens = await this.tokenService.generateTokens({ id: user.id, email: user.email })

        delete user.password

        this.loggerService.log(`login with: ${data.email}`, this.context)

        return { ...user, ...tokens }
      }
      else {
        this.loggerService.error('invalid password or code', this.context)

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
      const user = await this.userRepository.findOneBy({ id })

      const twoFa = speakeasy.generateSecret()
      const qrCodeUrl =
        speakeasy.otpauthURL({ secret: twoFa.base32, label: user.email, issuer: user.firstName, encoding: 'base32' })

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

  async resetTwoFaEmail(email: string, password: string) {
    try {
      const user = await this.userRepository.findOneBy({ email })

      if (user) {
        const isValidPass = await bcrypt.compare(password, user.password)

        if (isValidPass) {
          const tokens = await this.tokenService.generateTokens({ id: user.id, email }, false)

          await this.mailerService.sendMail({
            to: email,
            subject: 'Reset two factor verification.',
            html: `
                <p>Hello ${user.firstName}, use the link below for code reset.</p>
                <a href='${process.env.CLIENT_SITE_HOST}/login?resetTwoFa=true&token=${tokens.accessToken}'>
                  Link for two factor verification reset
                </a>
                <p>This link will be expired in 30 minutes.</p>
              `
          })

          return 'mail was sent'
        } else throw new Error()
      } else throw new Error()
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials...')
    }
  }

  async resetTwoFa(token: string) {
    try {
      const verified = this.tokenService.verifyToken(token, false)

      await this.userRepository.update({ id: verified.user.id }, { isTwoFa: false, twoFaHash: null })

      return 'two factor verification was disabled'
    } catch (error) {
      throw new BadRequestException('Sorry, this link was expired...')
    }
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import Token from './token.entity'
import User from '../user/user.entity'

@Injectable()
export default class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }

  async generateTokens(user: { [k: string]: string | number }, isInsert = true) {
    const accessToken =
      this.jwtService.sign({ user }, { secret: process.env.ACCESS_SECRET, expiresIn: process.env.ACCESS_EXPIRE })
    const refreshToken =
      this.jwtService.sign({ user }, { secret: process.env.REFRESH_SECRET, expiresIn: process.env.REFRESH_EXPIRE })

    if (isInsert) {
      const newToken = this.tokenRepository.create({ token: refreshToken, userId: user.id as number })

      await this.tokenRepository.save(newToken)
    }

    return { accessToken, refreshToken }
  }

  verifyToken(token: string, isRefresh = true) {
    try {
      return this.jwtService.verify(token, { secret: isRefresh ? process.env.REFRESH_SECRET : process.env.ACCESS_SECRET })
    } catch (err) {
      throw err
    }
  }

  async verifyRefresh(refreshToken: string) {
    try {
      const refresh = await this.tokenRepository.findOneBy({ token: refreshToken })

      if (refresh) {
        const { token, userId } = refresh

        const { email, id } = await this.userRepository.findOneBy({ id: userId })
  
        this.verifyToken(token)
  
        const tokens = await this.generateTokens({ email, id }, false)
  
        await this.tokenRepository.update({ token: refreshToken }, { token: tokens.refreshToken })
  
        return tokens
      } else {
        throw new UnauthorizedException('Refresh token not found!')
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError' ) {
        await this.tokenRepository.delete({ token: refreshToken })

        throw new UnauthorizedException('Token expired')
      }
      
      throw new UnauthorizedException('Unexpected error with refresh token')
    }
  }
  
  async removeToken(token: string) {
    try {
      await this.tokenRepository.delete({ token })
    } catch (err) {
      throw new UnauthorizedException('Error with token deleting...')
    }
  }
}

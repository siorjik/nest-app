import { Post, Body, Controller, HttpCode, HttpStatus, Res, Get, Req, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'

import AuthService from './auth.service'
import LoginDto from './dto/login.dto'
import ReturnUserDto from '../user/dto/returnUser.dto'
import { deleteCookie, parseCookie, setCookie } from './helpers/auth.cookieHelper'
import User from 'src/user/user.entity'
import { JwtAuthGuard } from './auth.guard'
import getCustomErr from 'src/helpers/getCustomErr'

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiTags('API')
  @ApiResponse({ status: 200, type: ReturnUserDto })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() data: LoginDto, @Res() res: Response): Promise<void> {
    const result = await this.authService.login(data) as { refresh: string, user: User }

    if (result) {
      setCookie(res, result.refresh)

      res.send(result.user)
    } else res.send(getCustomErr({ message: 'Invalid credentials...' }))
  }

  @ApiTags('API')
  @ApiResponse({ status: 200 })
  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response): Promise<void> {
    const cookie = req.headers['set-cookie'] || req.cookies.refresh

    if (cookie) {
      const token = Array.isArray(cookie) ? parseCookie(cookie, 'refresh') : cookie

      if (token) {
        try {
          const tokens = await this.authService.refresh(token)

          setCookie(res, tokens.refreshToken)

          res.send(tokens)
        } catch (error) {
          deleteCookie(res)

          res.status(401).send(error.response)
        }
      } else res.status(401).send(getCustomErr({ message: 'Refresh token from cookie does not exist...' }))
    } else res.status(401).send(getCustomErr({ message: 'Session does not exist or expired...' }))
  }

  @ApiTags('API')
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    const cookie = req.headers['set-cookie'] || req.cookies.refresh

    if (cookie) {
      const token = Array.isArray(cookie) ? parseCookie(cookie, 'refresh') : cookie

      if (token) {
        try {
          deleteCookie(res)

          await this.authService.logout(token)

          res.send('ok')
        } catch (error) {
          res.status(401).send(error.response)
        }
      } else res.status(401).send(getCustomErr({ message: 'Refresh token from cookie does not exist...' }))
    } else res.status(401).send(getCustomErr({ message: 'Session does not exist or expired...' }))
  }
}

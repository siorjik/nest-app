import { Post, Body, Controller, HttpCode, HttpStatus, Res, Get, Req, UseGuards, Param, ParseIntPipe } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'

import AuthService from './auth.service'
import LoginDto from './dto/login.dto'
import ReturnUserDto from '../user/dto/returnUser.dto'
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
    const result = await this.authService.login(data) as User & { tokens: { refreshToken: string, accessToken: string } }

    if (result) res.send(result)
    else res.status(401).send('Invalid credentials...')
  }

  @ApiTags('API')
  @ApiResponse({ status: 200 })
  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response): Promise<void> {
    const token = req.query.refresh

    if (token) {
      try {
        const tokens = await this.authService.refresh(token as string)

        res.send(tokens)
      } catch (error) {
        res.status(401).send(error.response)
      }
    } else res.status(401).send(getCustomErr({ message: 'Session does not exist or expired...' }))
  }

  @ApiTags('API')
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    const token = req.query.refresh

    if (token) {
      try {
        await this.authService.logout(token as string)

        res.send('ok')
      } catch (error) {
        res.status(401).send(error.response)
      }
    } else res.status(401).send(getCustomErr({ message: 'Refresh token does not exist...' }))
  }

  @ApiTags('API')
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get(':userId/two-fa')
  async createTwoFa(@Param('userId', ParseIntPipe) userId: number): Promise <{ qrCodeUrl: string }> {
    return await this.authService.createTwoFa(userId)
  }

  @ApiTags('API')
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('confirm-two-fa')
  async confirmTwoFa(@Body() data: { code: string, id: string }): Promise <User> {
    return await this.authService.confirmTwoFa(+data.id, data.code)
  }
}

import { Post, Body, Controller, HttpCode, HttpStatus, Res, Get, Req, UseGuards, Param, ParseIntPipe } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Request, Response } from 'express'

import AuthService from './auth.service'
import LoginDto from './dto/login.dto'
import ReturnUserDto from '../user/dto/returnUser.dto'
import User from 'src/user/user.entity'
import { JwtAuthGuard } from './auth.guard'
import getCustomErr from '../helpers/getCustomErr'
import ReturnCheckTwoFaDto from './dto/returnChectTwoFa.dto'
import CheckTwoFaDto from './dto/checkTwoFa.dto'
import UnauthorizedDto from '../dto/unauthorized.dto'
import ReturnRefreshDto from './dto/returnRefresh.dto'
import ReturnTwoFaDto from './dto/returnTwoFa.dto'
import BadRequestDto from '../dto/badRequest.dto'
import ConfirmTwoFa from './dto/confirmTwoFa.dto'
import ResetTwoFaEmailDto from './dto/resetTwoFaEmail.dto'
import ResetTwoFaDto from './dto/resetTwoFa.dto'

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiTags('Auth')
  @ApiResponse({ status: 200, type: ReturnUserDto })
  @ApiUnauthorizedResponse({ status: 401, type: 'Invalid credentials...' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() data: LoginDto, @Res() res: Response): Promise<void> {
    const result = await this.authService.login(data) as User & { refreshToken: string, accessToken: string }

    if (result) res.send(result)
    else res.status(401).send('Invalid credentials...')
  }

  @ApiTags('Auth')
  @ApiResponse({ status: 200, type: ReturnCheckTwoFaDto })
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @HttpCode(HttpStatus.OK)
  @Post('check-two-fa')
  async checkTwoFa(@Body() data: CheckTwoFaDto): Promise<{ isTwoFa: boolean }> {
    return this.authService.checkTwoFa(data.email)
  }

  @ApiTags('Auth')
  @ApiResponse({ status: 200, type: ReturnRefreshDto })
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @ApiQuery({ name: 'refresh', type: 'qrrwfeTgt45YH...gdeg', description: 'refresh token' })
  @HttpCode(HttpStatus.OK)
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

  @ApiTags('Auth')
  @ApiResponse({ status: 200, type: 'ok' })
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @ApiQuery({ name: 'refresh', type: 'qrrwfeTgt45YH...fdfh', description: 'refresh token' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
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

  @ApiTags('Auth')
  @ApiResponse({ status: 200, type: ReturnTwoFaDto })
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @ApiBadRequestResponse({ status: 400, type: BadRequestDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':userId/two-fa')
  async createTwoFa(@Param('userId', ParseIntPipe) userId: number): Promise <ReturnTwoFaDto> {
    return await this.authService.createTwoFa(userId)
  }

  @ApiTags('Auth')
  @ApiResponse({ status: 200, type: ReturnUserDto })
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @ApiBadRequestResponse({ status: 400, type: BadRequestDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('confirm-two-fa')
  async confirmTwoFa(@Body() data: ConfirmTwoFa): Promise <User> {
    return await this.authService.confirmTwoFa(+data.id, data.code)
  }

  @ApiTags('Auth')
  @ApiResponse({ status: 200, type: 'ok' })
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @HttpCode(HttpStatus.OK)
  @Post('reset-two-fa/email')
  async resetTwoFaEmail(@Body() data: ResetTwoFaEmailDto): Promise <string> {
    return await this.authService.resetTwoFaEmail(data.email, data.password)
  }

  @ApiTags('Auth')
  @ApiResponse({ status: 200, type: 'ok' })
  @ApiBadRequestResponse({ status: 400, type: BadRequestDto })
  @HttpCode(HttpStatus.OK)
  @Post('reset-two-fa')
  async resetTwoFa(@Body() data: ResetTwoFaDto): Promise <string> {
    return await this.authService.resetTwoFa(data.token)
  }
}

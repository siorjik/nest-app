import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { DeleteResult, UpdateResult } from 'typeorm'

import UserService from './user.service'
import CreateUserDto from './dto/createUser.dto'
import UpdateUserDto from './dto/updateUser.dto'
import ReturnUserDto from './dto/returnUser.dto'
import User from './user.entity'
import { JwtAuthGuard } from '../auth/auth.guard'

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('API')
  @ApiResponse({ status: 200, type: [ReturnUserDto] })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<User[]> {
    return await this.userService.getAll()
  }

  @ApiTags('API')
  @ApiResponse({ status: 200, type: ReturnUserDto })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.getById(id)
  }

  @ApiTags('API')
  @ApiResponse({ status: 201, type: ReturnUserDto })
  @Post('create')
  async create(@Body() data: CreateUserDto): Promise<User> {
    return await this.userService.create(data)
  }

  @ApiTags('API')
  @ApiResponse({ status: 201, type: 'success' })
  @Post('create-password')
  async createPassword(@Body() data: { password: string, token: string }): Promise<UpdateResult> {
    return await this.userService.createPassword(data.password, data.token)
  }

  @ApiTags('API')
  @ApiResponse({ status: 201, type: 'success' })
  @Post('recover-password')
  async recoverPassword(@Body() data: { email: string, password?: string, token?: string }): Promise<UpdateResult | string> {
    return await this.userService.recoverPassword(data.email, data.password, data.token)
  }

  @ApiTags('API')
  @ApiResponse({ status: 200, type: ReturnUserDto })
  @UseGuards(JwtAuthGuard)
  @Put(':id/update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto): Promise<User> {
    await this.userService.update(id, data)

    return await this.userService.getById(id)
  }

  @ApiTags('API')
  @UseGuards(JwtAuthGuard)
  @Delete(':id/delete')
  async remove (@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.userService.remove(id)
  }
}

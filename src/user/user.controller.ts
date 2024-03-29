import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
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

  @ApiTags('User')
  @ApiResponse({ status: 200, type: [ReturnUserDto] })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<User[]> {
    return await this.userService.getAll()
  }

  @ApiTags('User')
  @ApiResponse({ status: 200, type: ReturnUserDto })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.getById(id)
  }

  @ApiTags('User')
  @ApiResponse({ status: 201, type: ReturnUserDto })
  @Post('create')
  async create(@Body() data: CreateUserDto): Promise<User> {
    return await this.userService.create(data)
  }

  @ApiTags('User')
  @ApiResponse({ status: 201, type: 'success' })
  @Post('create-password')
  async createPassword(@Body() data: { password: string, token: string }): Promise<UpdateResult> {
    return await this.userService.createPassword(data.password, data.token)
  }

  @ApiTags('User')
  @ApiResponse({ status: 201, type: 'success' })
  @Post('recover-password')
  async recoverPassword(@Body() data: { email: string }): Promise<UpdateResult | string> {
    return await this.userService.recoverPassword(data.email)
  }

  @ApiTags('User')
  @ApiResponse({ status: 201, type: 'success' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id/update-password')
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { currentPass: string, newPass: string }
  ): Promise<User> {
    await this.userService.updatePassword(data.currentPass, data.newPass, id)

    return await this.userService.getById(id)
  }

  @ApiTags('User')
  @ApiResponse({ status: 200, type: ReturnUserDto })
  @UseGuards(JwtAuthGuard)
  @Patch(':id/update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto): Promise<User> {
    await this.userService.update(id, data)

    return await this.userService.getById(id)
  }

  @ApiTags('User')
  @UseGuards(JwtAuthGuard)
  @Delete(':id/delete')
  async remove (@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.userService.remove(id)
  }
}

import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, UpdateResult } from 'typeorm'
import * as bcrypt from 'bcrypt'

import User from './user.entity'
import CreateUserDto from './dto/createUser.dto'
import UpdateUserDto from './dto/updateUser.dto'
import MailerService from '../mailer/mailer.service'
import TokenService from '../token/token.service'

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly tokenService: TokenService
  ) { }

  async getAll(): Promise<User[]> {
    const users = await this.userRepository.find()

    users.forEach(user => delete user.password)

    return users
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id })

    delete user.password

    return user
  }

  async create(data: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email })

    if (user) throw new BadRequestException('This email already exists!')
    else {
      const newUser = this.userRepository.create(data)
      const createdUser = await this.userRepository.save(newUser)
      
      const tokens = await this.tokenService.generateTokens({ id: createdUser.id, email: createdUser.email }, false)

      await this.mailerService.sendMail({
        to: data.email,
        subject: 'Finish your registration.',
        html: `
          <p>Hello ${data.firstName}, you need to create password for your account.</p>
          <a href='${process.env.CLIENT_URL}/password-creating?accessToken=${tokens.accessToken}'>
            Link for password creating...
          </a>
          <p>This link will be expired in 30 minutes.</p>
        `
      })

      return createdUser
    }
  }

  async createPassword(password: string, token: string): Promise<UpdateResult> {
    try {
      const verified = this.tokenService.verifyToken(token, false)

      const hash = await bcrypt.hash(password, 10)

      return await this.userRepository.update({ id: verified.user.id }, { password: hash, isActive: true })
    } catch (err) {
      throw new BadRequestException('Sorry, this link was expired, please create new account...')
    }
  }

  async update(id: number, data: UpdateUserDto): Promise<UpdateResult> {
    const user = await this.userRepository.findOneBy({ email: data.email })

    if (user && user.id !== id) throw new BadRequestException('This email already exists!')

    return await this.userRepository.update({ id }, data)
  }

  async remove(id: number) {
    return await this.userRepository.delete({ id })
  }
}

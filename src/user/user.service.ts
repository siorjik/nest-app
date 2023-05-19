import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, UpdateResult } from 'typeorm'
import * as bcrypt from 'bcrypt'

import User from './user.entity'
import CreateUserDto from './dto/createUser.dto'
import UpdateUserDto from './dto/updateUser.dto'

@Injectable()
export default class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

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

  async create(data: CreateUserDto/* | any*/): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email })

    if (user) throw new BadRequestException(['This email already exists!'])
    else {
      //const hash = await bcrypt.hash(data.password, 10)

      const newUser = this.userRepository.create({ ...data/*, password: hash*/ })

      return await this.userRepository.save(newUser) /*as any*/
    }
  }

  async update(id: number, data: UpdateUserDto): Promise<UpdateResult> {
    const user = await this.userRepository.findOneBy({ email: data.email })

    if (user && user.id !== id) throw new BadRequestException(['This email already exists!'])

    return await this.userRepository.update({ id }, data)
  }

  async remove (id: number) {
    return await this.userRepository.delete({ id })
  }
}

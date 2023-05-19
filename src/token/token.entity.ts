import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

import User from '../user/user.entity'

@Entity('refreshTokens')
export default class Token {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  token: string

  @Column()
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User
}
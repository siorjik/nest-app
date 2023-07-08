import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'

import User from '../user/user.entity'

@Entity('refreshTokens')
export default class Token {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  token: string

  @Column()
  userId: number

  @CreateDateColumn({ type: 'timestamptz', default: () => "NOW()" })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz', default: () => "NOW()" })
  updatedAt: Date

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User
}
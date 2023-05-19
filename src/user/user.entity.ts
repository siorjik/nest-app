import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ default: false })
  isActive: boolean

  @Column()
  email: string

  @Column({ default: null })
  password: string
}
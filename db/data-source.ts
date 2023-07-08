import { DataSource, DataSourceOptions } from 'typeorm'
import { config } from 'dotenv'

import User from '../src/user/user.entity'
import Token from '../src/token/token.entity'

import User1680614445395 from './migrations/1680614445395-User'
import User1680616333198 from './migrations/1680616333198-User'
import User1680809088340 from './migrations/1680809088340-User'
import User1688797357090 from './migrations/1688797357090-User-dates_columns_adding'
import User1688798579812 from './migrations/1688798579812-User-dates_timestamp_adding'

import Token1682526646816 from './migrations/1682526646816-refreshToken_table_creating'
import Token1682605280041 from './migrations/1682605280041-refreshToken_cascade_deleting_added'
import Token1688799161199 from './migrations/1688799161199-Token-dates-columns-adding'

config({ path: `.env.${process.env.NODE_ENV}` })

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Token],
  migrations: [
    User1680614445395,
    User1680616333198,
    User1680809088340,
    Token1682526646816,
    Token1682605280041,
    User1688797357090,
    User1688798579812,
    Token1688799161199,
  ],
  logging: true,
  migrationsRun: true,
  //synchronize: true,
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource

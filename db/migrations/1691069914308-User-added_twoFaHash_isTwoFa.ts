import { MigrationInterface, QueryRunner } from "typeorm"

export default class User1691069914308 implements MigrationInterface {
    name = 'User1691069914308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isTwoFa" boolean NOT NULL DEFAULT false`)
        await queryRunner.query(`ALTER TABLE "users" ADD "twoFaHash" character varying`)
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isActive" SET DEFAULT false`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isActive" DROP DEFAULT`)
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "twoFaHash"`)
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isTwoFa"`)
    }
}

import { MigrationInterface, QueryRunner } from "typeorm"

export default class User1688797357090 implements MigrationInterface {
    name = 'User1688797357090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()`)
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`)
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`)
    }

}

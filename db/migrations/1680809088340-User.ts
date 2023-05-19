import { MigrationInterface, QueryRunner } from "typeorm"

export default class User1680809088340 implements MigrationInterface {
    name = 'User1680809088340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`)
    }

}

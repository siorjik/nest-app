import { MigrationInterface, QueryRunner } from "typeorm"

export default class User1680616333198 implements MigrationInterface {
    name = 'User1680616333198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`)
    }

}

import { MigrationInterface, QueryRunner } from "typeorm"

export default class Token1688799161199 implements MigrationInterface {
    name = 'Token1688799161199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refreshTokens" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()`)
        await queryRunner.query(`ALTER TABLE "refreshTokens" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refreshTokens" DROP COLUMN "updatedAt"`)
        await queryRunner.query(`ALTER TABLE "refreshTokens" DROP COLUMN "createdAt"`)
    }

}

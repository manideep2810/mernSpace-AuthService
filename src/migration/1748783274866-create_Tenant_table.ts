import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTenantTable1748783274866 implements MigrationInterface {
    name = 'CreateTenantTable1748783274866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "Tenants" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "address" character varying(255) NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5273745c311d7f81450dbe5d9b9" PRIMARY KEY ("id"))`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Tenants"`)
    }
}

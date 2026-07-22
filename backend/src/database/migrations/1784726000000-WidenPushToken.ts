import { MigrationInterface, QueryRunner } from 'typeorm';

export class WidenPushToken1784726000000 implements MigrationInterface {
  name = 'WidenPushToken1784726000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "push_tokens" ALTER COLUMN "token" TYPE text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "push_tokens" ALTER COLUMN "token" TYPE character varying(500)`,
    );
  }
}

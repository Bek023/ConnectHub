import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMessageReads1750807200000 implements MigrationInterface {
  name = 'AddMessageReads1750807200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "message_reads" (
        "id"         UUID NOT NULL DEFAULT gen_random_uuid(),
        "message_id" UUID NOT NULL,
        "user_id"    UUID NOT NULL,
        "read_at"    TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_message_reads"               PRIMARY KEY ("id"),
        CONSTRAINT "UQ_message_reads_message_user"  UNIQUE ("message_id", "user_id"),
        CONSTRAINT "FK_message_reads_message"        FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_message_reads_user"           FOREIGN KEY ("user_id")    REFERENCES "users"("id")    ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_message_reads_message" ON "message_reads" ("message_id")
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_message_reads_message"`);
    await queryRunner.query(`DROP TABLE "message_reads"`);
  }
}

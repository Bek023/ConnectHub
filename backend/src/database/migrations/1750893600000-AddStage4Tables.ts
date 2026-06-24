import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStage4Tables1750893600000 implements MigrationInterface {
  name = 'AddStage4Tables1750893600000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "post_likes" (
        "id"         UUID NOT NULL DEFAULT gen_random_uuid(),
        "post_id"    UUID NOT NULL,
        "user_id"    UUID NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_post_likes"              PRIMARY KEY ("id"),
        CONSTRAINT "UQ_post_likes_post_user"    UNIQUE ("post_id", "user_id"),
        CONSTRAINT "FK_post_likes_post"         FOREIGN KEY ("post_id") REFERENCES "posts"("id")  ON DELETE CASCADE,
        CONSTRAINT "FK_post_likes_user"         FOREIGN KEY ("user_id") REFERENCES "users"("id")  ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "call_participants" (
        "id"        UUID NOT NULL DEFAULT gen_random_uuid(),
        "call_id"   UUID NOT NULL,
        "user_id"   UUID NOT NULL,
        "joined_at" TIMESTAMP NOT NULL DEFAULT now(),
        "left_at"   TIMESTAMP,
        CONSTRAINT "PK_call_participants"           PRIMARY KEY ("id"),
        CONSTRAINT "UQ_call_participants_call_user" UNIQUE ("call_id", "user_id"),
        CONSTRAINT "FK_call_participants_call"      FOREIGN KEY ("call_id") REFERENCES "calls"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_call_participants_user"      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "push_tokens_platform_enum" AS ENUM('ios', 'android', 'web')
    `);

    await queryRunner.query(`
      CREATE TABLE "push_tokens" (
        "id"         UUID NOT NULL DEFAULT gen_random_uuid(),
        "user_id"    UUID NOT NULL,
        "token"      VARCHAR(500) NOT NULL,
        "platform"   "push_tokens_platform_enum" NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_push_tokens"              PRIMARY KEY ("id"),
        CONSTRAINT "UQ_push_tokens_user_token"   UNIQUE ("user_id", "token"),
        CONSTRAINT "FK_push_tokens_user"         FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "push_tokens"`);
    await queryRunner.query(`DROP TYPE "push_tokens_platform_enum"`);
    await queryRunner.query(`DROP TABLE "call_participants"`);
    await queryRunner.query(`DROP TABLE "post_likes"`);
  }
}

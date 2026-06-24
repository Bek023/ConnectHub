import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1750720800000 implements MigrationInterface {
  name = 'InitSchema1750720800000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"              UUID NOT NULL DEFAULT gen_random_uuid(),
        "username"        VARCHAR(50) NOT NULL,
        "email"           VARCHAR(255) NOT NULL,
        "password_hash"   TEXT NOT NULL,
        "display_name"    VARCHAR(100) NOT NULL,
        "avatar_url"      TEXT,
        "bio"             VARCHAR(300),
        "is_verified"     BOOLEAN NOT NULL DEFAULT false,
        "is_active"       BOOLEAN NOT NULL DEFAULT true,
        "refresh_token"   TEXT,
        "two_fa_secret"   TEXT,
        "two_fa_enabled"  BOOLEAN NOT NULL DEFAULT false,
        "google_id"       TEXT,
        "last_seen"       TIMESTAMP,
        "created_at"      TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "UQ_users_email"    UNIQUE ("email"),
        CONSTRAINT "PK_users"          PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "goals" (
        "id"           UUID NOT NULL DEFAULT gen_random_uuid(),
        "title"        VARCHAR(200) NOT NULL,
        "description"  VARCHAR(1000),
        "category"     VARCHAR(100) NOT NULL,
        "icon"         TEXT,
        "color"        TEXT,
        "member_count" INTEGER NOT NULL DEFAULT 0,
        "created_at"   TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_goals" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "user_goals" (
        "id"        UUID NOT NULL DEFAULT gen_random_uuid(),
        "user_id"   UUID NOT NULL,
        "goal_id"   UUID NOT NULL,
        "joined_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_goals" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_goals_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_goals_goal" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "groups" (
        "id"           UUID NOT NULL DEFAULT gen_random_uuid(),
        "name"         VARCHAR(200) NOT NULL,
        "description"  VARCHAR(1000),
        "avatar_url"   TEXT,
        "cover_url"    TEXT,
        "is_private"   BOOLEAN NOT NULL DEFAULT false,
        "invite_code"  TEXT,
        "max_members"  INTEGER NOT NULL DEFAULT 1000,
        "member_count" INTEGER NOT NULL DEFAULT 0,
        "goal_id"      UUID NOT NULL,
        "created_by"   UUID NOT NULL,
        "created_at"   TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_groups_invite_code" UNIQUE ("invite_code"),
        CONSTRAINT "PK_groups"             PRIMARY KEY ("id"),
        CONSTRAINT "FK_groups_goal"        FOREIGN KEY ("goal_id")    REFERENCES "goals"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_groups_created_by"  FOREIGN KEY ("created_by") REFERENCES "users"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "group_members_role_enum" AS ENUM('admin', 'moderator', 'member')
    `);

    await queryRunner.query(`
      CREATE TABLE "group_members" (
        "id"        UUID NOT NULL DEFAULT gen_random_uuid(),
        "group_id"  UUID NOT NULL,
        "user_id"   UUID NOT NULL,
        "role"      "group_members_role_enum" NOT NULL DEFAULT 'member',
        "joined_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_group_members"       PRIMARY KEY ("id"),
        CONSTRAINT "FK_group_members_group" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_group_members_user"  FOREIGN KEY ("user_id")  REFERENCES "users"("id")  ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "channels" (
        "id"               UUID NOT NULL DEFAULT gen_random_uuid(),
        "name"             VARCHAR(200) NOT NULL,
        "description"      VARCHAR(1000),
        "avatar_url"       TEXT,
        "subscriber_count" INTEGER NOT NULL DEFAULT 0,
        "goal_id"          UUID NOT NULL,
        "created_by"       UUID NOT NULL,
        "created_at"       TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_channels"            PRIMARY KEY ("id"),
        CONSTRAINT "FK_channels_goal"       FOREIGN KEY ("goal_id")    REFERENCES "goals"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_channels_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "channel_subscribers" (
        "id"            UUID NOT NULL DEFAULT gen_random_uuid(),
        "channel_id"    UUID NOT NULL,
        "user_id"       UUID NOT NULL,
        "subscribed_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_channel_subscribers"         PRIMARY KEY ("id"),
        CONSTRAINT "FK_channel_subscribers_channel" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_channel_subscribers_user"    FOREIGN KEY ("user_id")    REFERENCES "users"("id")    ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "messages_chat_type_enum"    AS ENUM('group', 'channel')
    `);
    await queryRunner.query(`
      CREATE TYPE "messages_message_type_enum" AS ENUM('text', 'image', 'video', 'file', 'voice', 'poll')
    `);

    await queryRunner.query(`
      CREATE TABLE "messages" (
        "id"             UUID NOT NULL DEFAULT gen_random_uuid(),
        "chat_type"      "messages_chat_type_enum"    NOT NULL,
        "chat_id"        UUID NOT NULL,
        "sender_id"      UUID NOT NULL,
        "content"        VARCHAR(4000),
        "message_type"   "messages_message_type_enum" NOT NULL DEFAULT 'text',
        "media_url"      TEXT,
        "media_metadata" JSONB,
        "reply_to"       UUID,
        "is_edited"      BOOLEAN NOT NULL DEFAULT false,
        "is_deleted"     BOOLEAN NOT NULL DEFAULT false,
        "created_at"     TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_messages"           PRIMARY KEY ("id"),
        CONSTRAINT "FK_messages_sender"    FOREIGN KEY ("sender_id") REFERENCES "users"("id"),
        CONSTRAINT "FK_messages_reply_to"  FOREIGN KEY ("reply_to")  REFERENCES "messages"("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_messages_chat" ON "messages" ("chat_type", "chat_id", "created_at" DESC)
    `);

    await queryRunner.query(`
      CREATE TABLE "message_reactions" (
        "id"         UUID NOT NULL DEFAULT gen_random_uuid(),
        "message_id" UUID NOT NULL,
        "user_id"    UUID NOT NULL,
        "emoji"      VARCHAR(10) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_message_reactions"         PRIMARY KEY ("id"),
        CONSTRAINT "FK_message_reactions_message" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_message_reactions_user"    FOREIGN KEY ("user_id")    REFERENCES "users"("id")    ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "posts_chat_type_enum" AS ENUM('group', 'channel')
    `);

    await queryRunner.query(`
      CREATE TABLE "posts" (
        "id"            UUID NOT NULL DEFAULT gen_random_uuid(),
        "chat_type"     "posts_chat_type_enum" NOT NULL,
        "chat_id"       UUID NOT NULL,
        "author_id"     UUID NOT NULL,
        "content"       VARCHAR(4000) NOT NULL,
        "media_urls"    JSONB,
        "like_count"    INTEGER NOT NULL DEFAULT 0,
        "comment_count" INTEGER NOT NULL DEFAULT 0,
        "is_pinned"     BOOLEAN NOT NULL DEFAULT false,
        "created_at"    TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_posts"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_posts_author" FOREIGN KEY ("author_id") REFERENCES "users"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "comments" (
        "id"         UUID NOT NULL DEFAULT gen_random_uuid(),
        "post_id"    UUID NOT NULL,
        "author_id"  UUID NOT NULL,
        "content"    VARCHAR(2000) NOT NULL,
        "reply_to"   UUID,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_comments"          PRIMARY KEY ("id"),
        CONSTRAINT "FK_comments_post"     FOREIGN KEY ("post_id")   REFERENCES "posts"("id")    ON DELETE CASCADE,
        CONSTRAINT "FK_comments_author"   FOREIGN KEY ("author_id") REFERENCES "users"("id"),
        CONSTRAINT "FK_comments_reply_to" FOREIGN KEY ("reply_to")  REFERENCES "comments"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "calls_type_enum"   AS ENUM('audio', 'video')
    `);
    await queryRunner.query(`
      CREATE TYPE "calls_status_enum" AS ENUM('ongoing', 'ended')
    `);

    await queryRunner.query(`
      CREATE TABLE "calls" (
        "id"           UUID NOT NULL DEFAULT gen_random_uuid(),
        "chat_id"      UUID NOT NULL,
        "initiator_id" UUID NOT NULL,
        "type"         "calls_type_enum"   NOT NULL,
        "status"       "calls_status_enum" NOT NULL DEFAULT 'ongoing',
        "started_at"   TIMESTAMP NOT NULL DEFAULT now(),
        "ended_at"     TIMESTAMP,
        CONSTRAINT "PK_calls"            PRIMARY KEY ("id"),
        CONSTRAINT "FK_calls_initiator"  FOREIGN KEY ("initiator_id") REFERENCES "users"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "notifications_type_enum" AS ENUM('message', 'reaction', 'comment', 'like', 'call', 'group_invite')
    `);

    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id"         UUID NOT NULL DEFAULT gen_random_uuid(),
        "user_id"    UUID NOT NULL,
        "type"       "notifications_type_enum" NOT NULL,
        "title"      TEXT NOT NULL,
        "body"       TEXT,
        "data"       JSONB,
        "is_read"    BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notifications"      PRIMARY KEY ("id"),
        CONSTRAINT "FK_notifications_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_notifications_user_unread" ON "notifications" ("user_id", "is_read") WHERE "is_read" = false
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_notifications_user_unread"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "notifications_type_enum"`);
    await queryRunner.query(`DROP TABLE "calls"`);
    await queryRunner.query(`DROP TYPE "calls_status_enum"`);
    await queryRunner.query(`DROP TYPE "calls_type_enum"`);
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TYPE "posts_chat_type_enum"`);
    await queryRunner.query(`DROP TABLE "message_reactions"`);
    await queryRunner.query(`DROP INDEX "IDX_messages_chat"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TYPE "messages_message_type_enum"`);
    await queryRunner.query(`DROP TYPE "messages_chat_type_enum"`);
    await queryRunner.query(`DROP TABLE "channel_subscribers"`);
    await queryRunner.query(`DROP TABLE "channels"`);
    await queryRunner.query(`DROP TABLE "group_members"`);
    await queryRunner.query(`DROP TYPE "group_members_role_enum"`);
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP TABLE "user_goals"`);
    await queryRunner.query(`DROP TABLE "goals"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}

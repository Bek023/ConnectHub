import { MigrationInterface, QueryRunner } from 'typeorm';

const COLUMNS: [string, string][] = [
  ['users', 'created_at'],
  ['users', 'last_seen'],
  ['goals', 'created_at'],
  ['user_goals', 'joined_at'],
  ['groups', 'created_at'],
  ['group_members', 'joined_at'],
  ['channels', 'created_at'],
  ['channel_subscribers', 'subscribed_at'],
  ['messages', 'created_at'],
  ['message_reactions', 'created_at'],
  ['message_reads', 'read_at'],
  ['posts', 'created_at'],
  ['post_likes', 'created_at'],
  ['comments', 'created_at'],
  ['calls', 'started_at'],
  ['calls', 'ended_at'],
  ['call_participants', 'joined_at'],
  ['call_participants', 'left_at'],
  ['notifications', 'created_at'],
  ['push_tokens', 'created_at'],
  ['push_tokens', 'updated_at'],
];

export class TimestampsToTimestamptz1753106400000 implements MigrationInterface {
  name = 'TimestampsToTimestamptz1753106400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const [table, column] of COLUMNS) {
      await queryRunner.query(
        `ALTER TABLE "${table}" ALTER COLUMN "${column}" TYPE timestamptz ` +
          `USING "${column}" AT TIME ZONE current_setting('TimeZone')`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const [table, column] of COLUMNS) {
      await queryRunner.query(
        `ALTER TABLE "${table}" ALTER COLUMN "${column}" TYPE timestamp ` +
          `USING "${column}" AT TIME ZONE current_setting('TimeZone')`,
      );
    }
  }
}

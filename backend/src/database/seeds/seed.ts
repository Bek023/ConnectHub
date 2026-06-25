import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import * as argon2 from 'argon2';
import * as path from 'path';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'postgres',
  database: process.env.DB_NAME ?? 'connecthub',
  entities: [path.join(__dirname, '..', '..', '**', '*.entity.{ts,js}')],
  synchronize: false,
});

const SEED_GOALS = [
  {
    title: 'Learn Programming',
    category: 'education',
    icon: '💻',
    color: '#4F46E5',
    description: 'Master software development skills',
  },
  {
    title: 'Get Fit',
    category: 'health',
    icon: '🏋️',
    color: '#059669',
    description: 'Build a consistent workout routine',
  },
  {
    title: 'Read More Books',
    category: 'personal',
    icon: '📚',
    color: '#D97706',
    description: 'Read at least one book per month',
  },
  {
    title: 'Learn a Language',
    category: 'education',
    icon: '🌍',
    color: '#7C3AED',
    description: 'Achieve conversational fluency',
  },
  {
    title: 'Start a Business',
    category: 'entrepreneurship',
    icon: '🚀',
    color: '#DC2626',
    description: 'Launch your own product or service',
  },
];

async function seed() {
  await AppDataSource.initialize();

  const userExists = await AppDataSource.query(
    `SELECT id FROM users WHERE email = 'admin@connecthub.app' LIMIT 1`,
  );

  if (userExists.length === 0) {
    const passwordHash = await argon2.hash('Admin123!');
    await AppDataSource.query(
      `INSERT INTO users (username, email, password_hash, display_name, is_verified, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['admin', 'admin@connecthub.app', passwordHash, 'Admin', true, true],
    );
    console.log('Seed user created: admin@connecthub.app / Admin123!');
  } else {
    console.log('Seed user already exists, skipping.');
  }

  for (const g of SEED_GOALS) {
    const exists = await AppDataSource.query(`SELECT id FROM goals WHERE title = $1 LIMIT 1`, [
      g.title,
    ]);
    if (exists.length === 0) {
      await AppDataSource.query(
        `INSERT INTO goals (title, description, category, icon, color)
         VALUES ($1, $2, $3, $4, $5)`,
        [g.title, g.description, g.category, g.icon, g.color],
      );
      console.log(`Goal created: ${g.title}`);
    }
  }

  await AppDataSource.destroy();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

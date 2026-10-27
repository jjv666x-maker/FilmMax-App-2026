import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';

const dbDir = path.resolve('./data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'filmmax.db');

const client = createClient({
  url: `file:${dbPath}`,
});

export const db = drizzle(client, { schema });

// Initialize tables and safe migrations if they don't exist
export async function initDatabase() {
  try {
    // 1. Users Table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        avatar TEXT,
        role TEXT DEFAULT 'user' NOT NULL,
        phone TEXT,
        password_hash TEXT,
        salt TEXT,
        preferences TEXT,
        is_premium INTEGER DEFAULT 0,
        premium_expiry TEXT,
        session_token TEXT,
        created_at TEXT NOT NULL
      );
    `);

    // Safe dynamic column additions for existing installations
    try {
      const tableInfo = await client.execute("PRAGMA table_info(users);");
      const existingCols = new Set(tableInfo.rows.map((r: any) => String(r.name || r[1] || '')));

      if (!existingCols.has('phone')) {
        await client.execute("ALTER TABLE users ADD COLUMN phone TEXT;");
      }
      if (!existingCols.has('password_hash')) {
        await client.execute("ALTER TABLE users ADD COLUMN password_hash TEXT;");
      }
      if (!existingCols.has('salt')) {
        await client.execute("ALTER TABLE users ADD COLUMN salt TEXT;");
      }
      if (!existingCols.has('preferences')) {
        await client.execute("ALTER TABLE users ADD COLUMN preferences TEXT;");
      }
      if (!existingCols.has('is_premium')) {
        await client.execute("ALTER TABLE users ADD COLUMN is_premium INTEGER DEFAULT 0;");
      }
      if (!existingCols.has('premium_expiry')) {
        await client.execute("ALTER TABLE users ADD COLUMN premium_expiry TEXT;");
      }
      if (!existingCols.has('session_token')) {
        await client.execute("ALTER TABLE users ADD COLUMN session_token TEXT;");
      }
    } catch (migErr) {
      console.warn('Column migration note:', migErr);
    }

    // 2. Sessions Table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 3. Subscriptions Table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        plan TEXT NOT NULL,
        status TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 4. Watchlist Table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        media_id TEXT NOT NULL,
        media_type TEXT NOT NULL,
        title TEXT NOT NULL,
        poster TEXT,
        added_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 5. Watch History Table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS watch_history (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        media_id TEXT NOT NULL,
        media_type TEXT NOT NULL,
        title TEXT NOT NULL,
        poster TEXT,
        progress REAL DEFAULT 0 NOT NULL,
        duration REAL DEFAULT 0 NOT NULL,
        watched_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 6. Reels Table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS reels (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        video_url TEXT NOT NULL,
        thumbnail_url TEXT,
        description TEXT,
        tags TEXT,
        likes_count INTEGER DEFAULT 0 NOT NULL,
        comments_count INTEGER DEFAULT 0 NOT NULL,
        views_count INTEGER DEFAULT 0 NOT NULL,
        shares_count INTEGER DEFAULT 0 NOT NULL,
        music_title TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 7. Reel Likes Table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS reel_likes (
        id TEXT PRIMARY KEY,
        reel_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (reel_id) REFERENCES reels(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 8. Reel Comments Table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS reel_comments (
        id TEXT PRIMARY KEY,
        reel_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (reel_id) REFERENCES reels(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 9. Stories Table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS stories (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_avatar TEXT,
        media_url TEXT NOT NULL,
        media_type TEXT DEFAULT 'image' NOT NULL,
        caption TEXT,
        duration INTEGER DEFAULT 5 NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 10. Performance Indexes & Unique Constraints
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_users_token ON users(session_token);`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_subs_user ON subscriptions(user_id);`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_watchlist_user_media ON watchlist(user_id, media_id);`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_history_user_media ON watch_history(user_id, media_id);`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_reels_user ON reels(user_id);`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_reel_likes_reel ON reel_likes(reel_id);`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_stories_user ON stories(user_id);`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_stories_created ON stories(created_at);`);
    // Ensure default demo VIP user exists for immediate reels & watchlist operations
    try {
      await client.execute({
        sql: `INSERT OR IGNORE INTO users (id, email, name, avatar, role, is_premium, created_at)
              VALUES (?, ?, ?, ?, ?, 1, ?);`,
        args: [
          'usr-vip-001',
          'mohamed@filmmax.vip',
          'محمد أحمد الحامد',
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          'vip_member',
          new Date().toISOString()
        ]
      });
    } catch (userSeedErr) {
      console.warn('Default user seed note:', userSeedErr);
    }

    console.log('Database and migrations initialized successfully at:', dbPath);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  role: text('role').default('user').notNull(), // 'user', 'vip_member', 'admin'
  phone: text('phone'),
  passwordHash: text('password_hash'),
  salt: text('salt'),
  preferences: text('preferences'), // JSON string: { favoriteGenre, avatarFrame, level, xp }
  isPremium: integer('is_premium', { mode: 'boolean' }).default(false),
  premiumExpiry: text('premium_expiry'),
  sessionToken: text('session_token'),
  createdAt: text('created_at').notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').notNull(),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  plan: text('plan').notNull(), // 'weekly', 'monthly', 'yearly'
  status: text('status').notNull(), // 'active', 'cancelled', 'expired'
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  price: real('price').notNull(),
});

export const watchlist = sqliteTable('watchlist', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  mediaId: text('media_id').notNull(),
  mediaType: text('media_type').notNull(), // 'movie', 'series', 'video'
  title: text('title').notNull(),
  poster: text('poster'),
  addedAt: text('added_at').notNull(),
});

export const watchHistory = sqliteTable('watch_history', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  mediaId: text('media_id').notNull(),
  mediaType: text('media_type').notNull(),
  title: text('title').notNull(),
  poster: text('poster'),
  progress: real('progress').default(0).notNull(), // seconds or percentage
  duration: real('duration').default(0).notNull(),
  watchedAt: text('watched_at').notNull(),
});
export const reels = sqliteTable('reels', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  videoUrl: text('video_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  description: text('description'),
  tags: text('tags'), // JSON array of strings
  likesCount: integer('likes_count').default(0).notNull(),
  commentsCount: integer('comments_count').default(0).notNull(),
  viewsCount: integer('views_count').default(0).notNull(),
  sharesCount: integer('shares_count').default(0).notNull(),
  musicTitle: text('music_title'),
  createdAt: text('created_at').notNull(),
});

export const reelLikes = sqliteTable('reel_likes', {
  id: text('id').primaryKey(),
  reelId: text('reel_id').notNull().references(() => reels.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').notNull(),
});

export const reelComments = sqliteTable('reel_comments', {
  id: text('id').primaryKey(),
  reelId: text('reel_id').notNull().references(() => reels.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull(),
});

export const stories = sqliteTable('stories', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  userName: text('user_name').notNull(),
  userAvatar: text('user_avatar'),
  mediaUrl: text('media_url').notNull(),
  mediaType: text('media_type').default('image').notNull(),
  caption: text('caption'),
  duration: integer('duration').default(5).notNull(),
  createdAt: integer('created_at').notNull(),
});

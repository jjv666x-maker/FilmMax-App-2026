import crypto from 'crypto';
import { db } from '../db/index';
import { users, sessions, subscriptions } from '../db/schema';
import { eq, and, gt } from 'drizzle-orm';

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Secure password hashing using Node.js native scrypt (memory-hard, resistant to GPU attacks)
 */
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

/**
 * Constant-time password verification to prevent timing side-channel attacks
 */
export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const computedHash = crypto.scryptSync(password, salt, 64);
    const expectedBuffer = Buffer.from(expectedHash, 'hex');
    if (computedHash.length !== expectedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(computedHash, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Generate a high-entropy cryptographically secure random session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Sanitize user object to never leak hash or salt to client
 */
export function sanitizeUser(user: any) {
  const { passwordHash, salt, ...safeUser } = user;
  return safeUser;
}

/**
 * Create a new user with secure password hash and initial session
 */
export async function registerUser({
  email,
  password,
  name,
  phone,
  avatar,
  preferences,
  role = 'user'
}: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  avatar?: string;
  preferences?: string;
  role?: string;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  
  // Check if user already exists
  const existing = await db.select().from(users).where(eq(users.email, normalizedEmail)).get();
  if (existing) {
    throw new Error('البريد الإلكتروني مسجل بالفعل، يرجى تسجيل الدخول أو استخدام بريد آخر');
  }

  const { salt, hash } = hashPassword(password);
  const userId = `USR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const now = new Date().toISOString();
  const sessionToken = generateSessionToken();
  const sessionExpiry = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  // Insert user
  await db.insert(users).values({
    id: userId,
    email: normalizedEmail,
    name: name.trim(),
    phone: phone?.trim() || null,
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    role,
    passwordHash: hash,
    salt,
    preferences: preferences || JSON.stringify({ favoriteGenres: ['أكشن'], theme: 'dark' }),
    isPremium: true, // VIP welcome trial
    premiumExpiry: new Date(Date.now() + 30 * 86400000).toISOString(),
    sessionToken,
    createdAt: now
  });

  // Create initial session
  const sessionId = `SES-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  await db.insert(sessions).values({
    id: sessionId,
    userId,
    token: sessionToken,
    expiresAt: sessionExpiry,
    createdAt: now
  });

  // Create initial subscription record
  const subId = `SUB-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  await db.insert(subscriptions).values({
    id: subId,
    userId,
    plan: 'monthly',
    status: 'active',
    startDate: now,
    endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    price: 12000
  });

  const createdUser = await db.select().from(users).where(eq(users.id, userId)).get();
  return {
    user: sanitizeUser(createdUser),
    token: sessionToken,
    expiresAt: sessionExpiry
  };
}

/**
 * Authenticate existing user by email and password
 */
export async function loginUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await db.select().from(users).where(eq(users.email, normalizedEmail)).get();

  if (!user) {
    throw new Error('بيانات الدخول غير صحيحة، يرجى التحقق من البريد الإلكتروني وكلمة المرور');
  }

  // If user has passwordHash, verify it
  if (user.passwordHash && user.salt) {
    const isValid = verifyPassword(password, user.salt, user.passwordHash);
    if (!isValid) {
      throw new Error('بيانات الدخول غير صحيحة، يرجى التحقق من البريد الإلكتروني وكلمة المرور');
    }
  } else {
    // Legacy migration: set password for pre-existing records on first login
    const { salt, hash } = hashPassword(password);
    await db.update(users)
      .set({ passwordHash: hash, salt })
      .where(eq(users.id, user.id));
  }

  // Generate new active session
  const sessionToken = generateSessionToken();
  const sessionExpiry = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  const now = new Date().toISOString();

  await db.update(users)
    .set({ sessionToken })
    .where(eq(users.id, user.id));

  const sessionId = `SES-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  await db.insert(sessions).values({
    id: sessionId,
    userId: user.id,
    token: sessionToken,
    expiresAt: sessionExpiry,
    createdAt: now
  });

  // Fetch subscription
  const sub = await db.select().from(subscriptions).where(eq(subscriptions.userId, user.id)).get();

  return {
    user: sanitizeUser(user),
    token: sessionToken,
    subscription: sub || null,
    expiresAt: sessionExpiry
  };
}

/**
 * Verify session token and retrieve authenticated user and subscription
 */
export async function authenticateSession(token: string) {
  if (!token || token.length < 10) {
    return null;
  }

  const now = new Date().toISOString();

  // Try finding in sessions table
  const session = await db.select().from(sessions)
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, now)))
    .get();

  let user = null;
  if (session) {
    user = await db.select().from(users).where(eq(users.id, session.userId)).get();
  } else {
    // Fallback to user sessionToken
    user = await db.select().from(users).where(eq(users.sessionToken, token)).get();
  }

  if (!user) {
    return null;
  }

  const sub = await db.select().from(subscriptions).where(eq(subscriptions.userId, user.id)).get();

  return {
    user: sanitizeUser(user),
    subscription: sub || null
  };
}

/**
 * Invalidate session token
 */
export async function logoutSession(token: string) {
  if (!token) return;
  await db.delete(sessions).where(eq(sessions.token, token));
}

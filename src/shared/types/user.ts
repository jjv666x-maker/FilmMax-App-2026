export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  email?: string;
  avatar?: string;
  language?: string;
  theme?: 'dark' | 'light';
  isPremium?: boolean;
  premiumExpiry?: string;
  favoriteGenre?: string;
  twoFactorEnabled?: boolean;
  achievements?: string[];
  evolutionPlan?: 'monthly' | 'yearly' | 'vip';
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  badge?: string;
  isPremium?: boolean;
  premiumExpiry?: string;
  role?: 'owner' | 'member' | 'kid';
}

export interface AuthSession {
  userId: string;
  token: string;
  profileId: string;
  isAuthenticated: boolean;
  lastSeen: number;
}

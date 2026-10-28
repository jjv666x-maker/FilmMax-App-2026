import { UserProfile, UserAccount } from '../types';
import { filmmaxStorage } from './filmmaxStorage';

export const PROFILE_STORAGE_KEYS = {
  active: 'filmmax_active_profile_v1',
  accounts: 'filmmax_accounts_v1'
};

const defaultProfile = (): UserProfile => ({
  id: 'profile-default',
  name: 'المستخدم الرئيسي',
  username: 'user_main',
  email: 'user@filmmax.vip',
  phone: '+966500000000',
  avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  isPremium: true,
  premiumExpiry: '31/12/2026',
  favoriteGenre: 'أكشن',
  language: 'ar',
  theme: 'dark',
  twoFactorEnabled: true,
  achievements: [],
  evolutionPlan: 'monthly'
});

export const validateProfile = (
  profile: Partial<UserProfile> | null | undefined
): UserProfile => {
  const base = defaultProfile();

  if (!profile || typeof profile !== 'object') return base;

  return {
    ...base,
    ...profile,
    id: profile.id || base.id,
    name: profile.name || base.name,
    email: profile.email || base.email,
    avatar: profile.avatar || base.avatar,
    isPremium: Boolean(profile.isPremium ?? true),
    premiumExpiry: profile.premiumExpiry || base.premiumExpiry,
    language: profile.language || base.language,
    theme: profile.theme || base.theme,
    twoFactorEnabled: Boolean(profile.twoFactorEnabled ?? true)
  };
};

export const getActiveProfile = (): UserProfile => {
  const stored = filmmaxStorage.getItem<UserProfile | null>(
    PROFILE_STORAGE_KEYS.active,
    null
  );
  return validateProfile(stored);
};

export const setActiveProfile = (
  profile: Partial<UserProfile>
): UserProfile => {
  const normalized = validateProfile(profile);
  filmmaxStorage.setItem(PROFILE_STORAGE_KEYS.active, normalized);
  return normalized;
};

export const getUserAccounts = (): UserAccount[] => {
  const accounts = filmmaxStorage.getItem<UserAccount[]>(
    PROFILE_STORAGE_KEYS.accounts,
    []
  );

  if (!Array.isArray(accounts) || accounts.length === 0) {
    return [
      {
        id: 'acc-1',
        name: 'الحساب الرئيسي',
        email: 'main@filmmax.vip',
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        badge: 'VIP',
        isPremium: true,
        premiumExpiry: '31/12/2026',
        role: 'owner'
      }
    ];
  }

  return accounts;
};

export const setUserAccounts = (accounts: UserAccount[]): UserAccount[] => {
  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  filmmaxStorage.setItem(PROFILE_STORAGE_KEYS.accounts, safeAccounts);
  return safeAccounts;
};

export const switchAccount = (accountId: string): UserAccount | null => {
  const accounts = getUserAccounts();
  const account = accounts.find((item) => item.id === accountId) || accounts[0];

  if (!account) return null;

  setActiveProfile({
    id: account.id,
    name: account.name,
    email: account.email,
    avatar: account.avatar,
    isPremium: account.isPremium,
    premiumExpiry: account.premiumExpiry || '31/12/2026',
    language: 'ar',
    theme: 'dark'
  });

  return account;
};

export const profileService = {
  getActiveProfile,
  setActiveProfile,
  getUserAccounts,
  setUserAccounts,
  switchAccount,
  validateProfile
};

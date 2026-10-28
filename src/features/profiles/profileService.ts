import { UserProfile, UserAccount } from '../../shared/types';
import { secureStorage } from '../../core/storage/secureStorage';

export const ACTIVE_PROFILE_KEY = 'filmmax_active_profile_v1';
export const USER_ACCOUNTS_KEY = 'filmmax_accounts_v1';

const defaultProfile: UserProfile = {
  id: 'profile-default',
  name: 'المستخدم الرئيسي',
  username: 'user_main',
  email: 'user@filmmax.vip',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  isPremium: true,
  premiumExpiry: '31/12/2026',
  favoriteGenre: 'أكشن',
  language: 'ar',
  theme: 'dark',
  twoFactorEnabled: true
};

export const getActiveProfile = (): UserProfile => {
  return secureStorage.getItem<UserProfile | null>(ACTIVE_PROFILE_KEY, defaultProfile) ?? defaultProfile;
};

export const setActiveProfile = (profile: Partial<UserProfile>): UserProfile => {
  const next = { ...defaultProfile, ...profile };
  secureStorage.setItem(ACTIVE_PROFILE_KEY, next);
  return next;
};

export const getUserAccounts = (): UserAccount[] => {
  const accounts = secureStorage.getItem<UserAccount[]>(USER_ACCOUNTS_KEY, [
    {
      id: 'acc-1',
      name: 'الحساب الرئيسي',
      email: 'main@filmmax.vip',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      badge: 'VIP',
      isPremium: true,
      premiumExpiry: '31/12/2026',
      role: 'owner'
    }
  ]);

  return accounts;
};

export const setUserAccounts = (accounts: UserAccount[]): UserAccount[] => {
  secureStorage.setItem(USER_ACCOUNTS_KEY, accounts);
  return accounts;
};

export const switchAccount = (accountId: string): UserAccount | null => {
  const accounts = getUserAccounts();
  const account = accounts.find((a) => a.id === accountId) ?? accounts[0];
  if (!account) return null;

  setActiveProfile({
    id: account.id,
    name: account.name,
    email: account.email,
    avatar: account.avatar,
    isPremium: account.isPremium,
    premiumExpiry: account.premiumExpiry,
    language: 'ar',
    theme: 'dark'
  });

  return account;
};

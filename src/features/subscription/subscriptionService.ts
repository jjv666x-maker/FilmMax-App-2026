export type SubscriptionTier = 'free' | 'premium' | 'vip';

export interface SubscriptionState {
  tier: SubscriptionTier;
  expiresAt?: string;
  isActive: boolean;
}

export const subscriptionService = {
  getSubscriptionState: (): SubscriptionState => ({
    tier: 'premium',
    expiresAt: '31/12/2026',
    isActive: true
  }),

  canAccessContent: (tier: SubscriptionTier, required: SubscriptionTier): boolean => {
    const rank = { free: 1, premium: 2, vip: 3 };
    return rank[tier] >= rank[required];
  }
};

import { AuthSession } from '../../shared/types';

export const authService = {
  login: async (): Promise<AuthSession> => ({
    userId: 'user-1',
    token: 'demo-token',
    profileId: 'profile-default',
    isAuthenticated: true,
    lastSeen: Date.now()
  }),

  logout: async (): Promise<void> => {
    return;
  }
};

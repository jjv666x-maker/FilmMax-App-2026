export interface UserSession {
  userId: string;
  token: string;
  profileId: string;
  isAuthenticated: boolean;
  lastSeen: number;
}

export interface PlatformState {
  session: UserSession | null;
  selectedProfileId: string | null;
  homeFeed: any[];
  recommendations: any[];
  continueWatching: any[];
  favorites: any[];
}

export const defaultPlatformState: PlatformState = {
  session: null,
  selectedProfileId: null,
  homeFeed: [],
  recommendations: [],
  continueWatching: [],
  favorites: []
};

export const normalizeSession = (session: Partial<UserSession> | null | undefined): UserSession | null => {
  if (!session || !session.userId || !session.token) return null;

  return {
    userId: session.userId,
    token: session.token,
    profileId: session.profileId || session.userId,
    isAuthenticated: Boolean(session.isAuthenticated ?? true),
    lastSeen: session.lastSeen || Date.now()
  };
};

export const buildPlatformState = (state?: Partial<PlatformState>): PlatformState => ({
  ...defaultPlatformState,
  ...state,
  session: normalizeSession(state?.session ?? null)
});

export const platformStateManager = {
  defaultPlatformState,
  normalizeSession,
  buildPlatformState
};

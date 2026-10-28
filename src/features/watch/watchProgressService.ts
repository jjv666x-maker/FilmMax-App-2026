import { ContinueWatching } from '../../shared/types';
import { secureStorage } from '../../core/storage/secureStorage';

export const WATCH_PROGRESS_KEY = 'filmmax_watch_progress_v1';

export const saveProgress = (
  userId: string,
  item: ContinueWatching
): ContinueWatching => {
  const stored = secureStorage.getItem<Record<string, ContinueWatching>>(
    `${WATCH_PROGRESS_KEY}_${userId}`,
    {}
  );

  const next: ContinueWatching = {
    ...item,
    progress:
      item.duration > 0
        ? Math.min(100, (item.currentTime / item.duration) * 100)
        : item.progress,
    lastWatched: Date.now()
  };

  stored[`${item.videoId}`] = next;
  secureStorage.setItem(`${WATCH_PROGRESS_KEY}_${userId}`, stored);

  return next;
};

export const getProgress = (
  userId: string,
  videoId: string | number
): ContinueWatching | null => {
  const stored = secureStorage.getItem<Record<string, ContinueWatching>>(
    `${WATCH_PROGRESS_KEY}_${userId}`,
    {}
  );

  return stored[String(videoId)] ?? null;
};

export const getContinueWatchingList = (userId: string): ContinueWatching[] => {
  const stored = secureStorage.getItem<Record<string, ContinueWatching>>(
    `${WATCH_PROGRESS_KEY}_${userId}`,
    {}
  );

  return Object.values(stored).sort((a, b) => b.lastWatched - a.lastWatched);
};

export const syncWatchProgress = async (
  userId: string,
  payload: ContinueWatching
): Promise<boolean> => {
  try {
    const response = await fetch('/api/watch/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, payload })
    });

    return response.ok;
  } catch {
    return false;
  }
};

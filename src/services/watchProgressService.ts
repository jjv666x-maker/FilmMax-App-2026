import { ContinueWatching } from '../types';
import { filmmaxStorage } from './filmmaxStorage';

export interface PlaybackSyncPayload {
  userId: string;
  mediaId: string | number;
  mediaType: string;
  title: string;
  poster: string;
  currentTime: number;
  duration: number;
}

export const WATCH_PROGRESS_KEY = 'filmmax_watch_progress_v1';

export const saveProgress = (
  userId: string,
  item: ContinueWatching
): ContinueWatching => {
  const stored = filmmaxStorage.getItem<Record<string, ContinueWatching>>(
    WATCH_PROGRESS_KEY,
    {}
  );

  const next: ContinueWatching = {
    ...item,
    lastWatched: Date.now(),
    progress:
      item.duration > 0
        ? Math.min(100, (item.currentTime / item.duration) * 100)
        : item.progress
  };

  stored[userId] = next;
  filmmaxStorage.setItem(WATCH_PROGRESS_KEY, stored);

  return next;
};

export const getProgress = (
  userId: string,
  videoId: string | number
): ContinueWatching | null => {
  const stored = filmmaxStorage.getItem<Record<string, ContinueWatching>>(
    WATCH_PROGRESS_KEY,
    {}
  );

  const item = stored[userId];
  if (!item || String(item.videoId) !== String(videoId)) return null;

  return item;
};

export const getContinueWatchingList = (userId: string): ContinueWatching[] => {
  const stored = filmmaxStorage.getItem<Record<string, ContinueWatching>>(
    WATCH_PROGRESS_KEY,
    {}
  );

  const item = stored[userId];
  return item ? [item] : [];
};

export const syncProgressToServer = async (
  payload: PlaybackSyncPayload
): Promise<boolean> => {
  try {
    const response = await fetch('/api/playback/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch {
    return false;
  }
};

export const resumeProgressFromServer = async (
  userId: string
): Promise<ContinueWatching[]> => {
  try {
    const response = await fetch(`/api/playback/sync/${userId}`);
    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data?.items) ? data.items : [];
  } catch {
    return [];
  }
};

export const watchProgressService = {
  saveProgress,
  getProgress,
  getContinueWatchingList,
  syncProgressToServer,
  resumeProgressFromServer
};

import { filmmaxStorage } from './filmmaxStorage';
import { UserProfile } from '../shared/types';

export const safeAppState = <T>(key: string, fallback: T): T => {
  return filmmaxStorage.getItem<T>(key, fallback);
};

export const writeAppState = <T>(key: string, value: T): boolean => {
  return filmmaxStorage.setItem(key, value);
};

export const safeArray = <T>(value: unknown, fallback: T[] = []): T[] => {
  if (Array.isArray(value)) return value;
  return fallback;
};

export const safeObject = <T extends Record<string, any>>(value: unknown, fallback: T): T => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as T;
  }
  return fallback;
};

export const safeValue = <T>(value: T | null | undefined, fallback: T): T => {
  if (value !== null && value !== undefined) return value;
  return fallback;
};

export const safeMovieId = (id: string | number | null | undefined): string => {
  if (id === null || id === undefined) return `movie-${Date.now()}`;
  return String(id).trim() || `movie-${Date.now()}`;
};

export const safeUrl = (url: string | null | undefined, fallback: string): string => {
  if (!url || typeof url !== 'string') return fallback;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('data:')) {
    return url;
  }
  return fallback;
};

export const normalizeUserProfile = <T extends Record<string, any>>(
  profile: T | null | undefined,
  fallback: T
): T => {
  if (!profile || typeof profile !== 'object') return fallback;
  return {
    ...fallback,
    ...profile
  };
};

export const safeFetchJson = async <T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  fallback: T | null = null
): Promise<T | null> => {
  try {
    const res = await fetch(input, init);
    if (!res.ok) return fallback;
    const data = await res.json();
    return data as T;
  } catch {
    return fallback;
  }
};

export const appRuntimeGuard = {
  safeAppState,
  writeAppState,
  safeArray,
  safeObject,
  safeValue,
  safeMovieId,
  safeUrl,
  normalizeUserProfile,
  safeFetchJson
};

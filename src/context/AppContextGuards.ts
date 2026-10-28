import {
  safeAppState,
  writeAppState,
  safeArray,
  safeObject,
  safeValue,
  safeMovieId,
  safeUrl,
  safeFetchJson,
  normalizeUserProfile
} from '../services/appRuntimeGuard';

export const appStateGuard = {
  read<T>(key: string, fallback: T): T {
    return safeAppState(key, fallback);
  },

  write<T>(key: string, value: T): boolean {
    return writeAppState(key, value);
  },

  movies<T>(value: unknown, fallback: T[] = [] as T[]): T[] {
    return safeArray<T>(value, fallback);
  },

  profile<T extends Record<string, any>>(value: T | null | undefined, fallback: T): T {
    return normalizeUserProfile(value, fallback);
  },

  movieId(id: string | number | null | undefined): string {
    return safeMovieId(id);
  },

  url(url: string | null | undefined, fallback: string): string {
    return safeUrl(url, fallback);
  },

  object<T extends Record<string, any>>(value: unknown, fallback: T): T {
    return safeObject(value, fallback);
  },

  value<T>(value: T | null | undefined, fallback: T): T {
    return safeValue(value, fallback);
  },

  fetchJson<T>(input: RequestInfo | URL, init?: RequestInit, fallback: T | null = null): Promise<T | null> {
    return safeFetchJson(input, init, fallback);
  }
};

export const AppContextGuard = {
  appStateGuard,
  safe: {
    read: safeAppState,
    write: writeAppState,
    array: safeArray,
    object: safeObject,
    value: safeValue,
    url: safeUrl,
    movieId: safeMovieId
  }
};

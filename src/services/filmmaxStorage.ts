export type StorageMode = 'safe' | 'raw';

const isBrowser = (): boolean => typeof window !== 'undefined' && !!window.localStorage;

const hashString = (value: string): string => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
};

const signedKey = (key: string): string => `fmv2_${hashString(key)}`;

const safeReadRaw = (key: string): string | null => {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeWriteRaw = (key: string, value: string): boolean => {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const safeRemoveRaw = (key: string): void => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {}
};

export const filmmaxStorage = {
  getItem<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;
    const signed = safeReadRaw(signedKey(key));
    if (signed) {
      try {
        const parsed = JSON.parse(signed);
        if (parsed && typeof parsed === 'object' && 'data' in parsed && 'sig' in parsed) {
          const expected = hashString(`${key}:${parsed.data}`);
          if (parsed.sig === expected) {
            return JSON.parse(parsed.data);
          }
          safeRemoveRaw(signedKey(key));
        }
      } catch {
        safeRemoveRaw(signedKey(key));
      }
    }

    const raw = safeReadRaw(key);
    if (!raw) return fallback;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  },

  setItem<T>(key: string, value: T): boolean {
    if (!isBrowser()) return false;
    try {
      const serialized = JSON.stringify(value);
      const payload = JSON.stringify({
        data: serialized,
        sig: hashString(`${key}:${serialized}`)
      });
      return safeWriteRaw(signedKey(key), payload) && safeWriteRaw(key, serialized);
    } catch {
      return false;
    }
  },

  removeItem(key: string): void {
    safeRemoveRaw(signedKey(key));
    safeRemoveRaw(key);
  },

  readString(key: string, fallback = ''): string {
    const raw = safeReadRaw(key) || safeReadRaw(signedKey(key));
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === 'string' ? parsed : raw;
    } catch {
      return raw;
    }
  },

  writeString(key: string, value: string): boolean {
    return safeWriteRaw(key, value);
  }
};

export const makeStorageKey = (prefix: string, suffix: string): string => `${prefix}_${suffix}`;

export const safeJsonParse = <T>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const safeJsonStringify = <T>(value: T): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return '{}';
  }
};

const isBrowser = () => typeof window !== 'undefined' && !!window.localStorage;

function hashString(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash) + value.charCodeAt(i);
    hash = hash & 0xffffffff;
  }
  return Math.abs(hash).toString(36);
}

const STORAGE_SALT = 'FILMMAX_SECURE_V1';

export const secureStorage = {
  getItem<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;

    try {
      const raw = window.localStorage.getItem(`fm_${key}`);
      if (!raw) return fallback;

      const parsed = JSON.parse(raw);
      const expected = hashString(`${STORAGE_SALT}:${key}:${parsed.data}`);

      if (!parsed || !parsed.data || parsed.sig !== expected) {
        window.localStorage.removeItem(`fm_${key}`);
        return fallback;
      }

      return JSON.parse(parsed.data) as T;
    } catch {
      return fallback;
    }
  },

  setItem<T>(key: string, value: T): boolean {
    if (!isBrowser()) return false;

    try {
      const payload = JSON.stringify(value);
      const signed = {
        data: payload,
        sig: hashString(`${STORAGE_SALT}:${key}:${payload}`)
      };

      window.localStorage.setItem(`fm_${key}`, JSON.stringify(signed));
      return true;
    } catch {
      return false;
    }
  },

  removeItem(key: string): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(`fm_${key}`);
    } catch {}
  }
};

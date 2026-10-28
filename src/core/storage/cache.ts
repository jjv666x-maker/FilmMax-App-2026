export class CacheStore<T> {
  private store = new Map<string, T>();
  private ttlMs: number;

  constructor(ttlMs = 5 * 60 * 1000) {
    this.ttlMs = ttlMs;
  }

  get(key: string): T | undefined {
    const value = this.store.get(key);
    if (!value) return undefined;

    const entry = value as any;
    if (entry && entry.__expiresAt && Date.now() > entry.__expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return value;
  }

  set(key: string, value: T): void {
    const entry = {
      ...value,
      __expiresAt: Date.now() + this.ttlMs
    } as any;

    this.store.set(key, entry);
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

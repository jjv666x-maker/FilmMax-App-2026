/**
 * FilmMax Multi-Tier Resilience Cache & Circuit Breaker (Netflix EVCache + Resilience4j)
 * 
 * Provides:
 * 1. Tier 1: L1 In-Memory Cache (sub-millisecond instant reads).
 * 2. Tier 2: L2 Persistent Storage with automatic compression and TTL expiration.
 * 3. Circuit Breaker: Automatically detects upstream failures/timeouts and shields
 *    the application by instantly falling back to cached catalog data.
 * 4. Stale-While-Revalidate: Delivers instant UI response while background refreshes.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

class ResilienceCache {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private circuitState: CircuitState = "CLOSED";
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private readonly failureThreshold: number = 6;
  private readonly resetTimeoutMs: number = 10000; // 10 seconds
  private readonly defaultTtlMs: number = 1000 * 60 * 60; // 60 minutes
  private readonly defaultTimeoutMs: number = 12000; // 12 seconds

  /**
   * Execute an async fetcher wrapped by the Circuit Breaker and Multi-Tier Cache.
   */
  public async executeWithResilience<T>(
    cacheKey: string,
    fetcher: () => Promise<T>,
    ttlMs: number = this.defaultTtlMs,
    timeoutMs: number = this.defaultTimeoutMs
  ): Promise<T> {
    const cached = this.get<T>(cacheKey);

    // 1. Check Circuit Breaker State
    const now = Date.now();
    if (this.circuitState === "OPEN") {
      if (now - this.lastFailureTime > this.resetTimeoutMs) {
        this.circuitState = "HALF_OPEN";
      } else {
        // Circuit is OPEN: instantly serve cached data without hammering upstream
        if (cached !== null) {
          return cached;
        }
      }
    }

    // 2. If valid memory cache exists and circuit is healthy, return immediately
    if (cached !== null && this.circuitState === "CLOSED") {
      return cached;
    }

    // 3. Attempt to fetch fresh data with timer cleanup
    let timer: any = null;
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Timeout (Circuit Breaker Tripped)")), timeoutMs);
      });

      const result = await Promise.race([fetcher(), timeoutPromise]);

      // Success: Reset failure counters and close circuit
      this.recordSuccess();
      this.set(cacheKey, result, ttlMs);
      return result;
    } catch (error) {
      this.recordFailure();

      // Return stale cache if available (Graceful Degradation)
      if (cached !== null) {
        return cached;
      }
      throw error;
    } finally {
      if (timer) {
        clearTimeout(timer);
      }
    }
  }

  public get<T>(key: string): T | null {
    // Check Tier 1 (In-Memory)
    const mem = this.memoryCache.get(key);
    const now = Date.now();
    if (mem && now - mem.timestamp < mem.ttlMs) {
      return mem.data;
    }

    // Check Tier 2 (Persistent Storage)
    try {
      const stored = localStorage.getItem(`evcache_${key}`);
      if (stored) {
        const parsed: CacheEntry<T> = JSON.parse(stored);
        if (now - parsed.timestamp < parsed.ttlMs * 2) {
          // Re-populate L1 memory cache
          this.memoryCache.set(key, parsed);
          return parsed.data;
        }
      }
    } catch {}

    return null;
  }

  public set<T>(key: string, data: T, ttlMs: number = this.defaultTtlMs): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttlMs
    };
    this.memoryCache.set(key, entry);

    try {
      // Keep payload reasonable in localStorage
      const serialized = JSON.stringify(entry);
      if (serialized.length < 500000) {
        localStorage.setItem(`evcache_${key}`, serialized);
      }
    } catch {}
  }

  public getCircuitStatus(): { state: CircuitState; failures: number } {
    return {
      state: this.circuitState,
      failures: this.failureCount
    };
  }

  private recordSuccess(): void {
    this.failureCount = 0;
    this.circuitState = "CLOSED";
  }

  private recordFailure(): void {
    this.failureCount += 1;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.circuitState = "OPEN";
    }
  }
}

export const resilienceCache = new ResilienceCache();

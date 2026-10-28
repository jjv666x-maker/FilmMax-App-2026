export class RateLimiter {
  private timestamps: Map<string, number[]> = new Map();

  check(actionKey: string, maxRequests = 10, windowMs = 60000): boolean {
    const now = Date.now();
    const records = this.timestamps.get(actionKey) || [];
    const valid = records.filter((time) => now - time < windowMs);

    if (valid.length >= maxRequests) {
      return false;
    }

    valid.push(now);
    this.timestamps.set(actionKey, valid);
    return true;
  }

  reset(actionKey: string): void {
    this.timestamps.delete(actionKey);
  }
}

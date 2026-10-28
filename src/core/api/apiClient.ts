export async function apiRequest<T>(
  url: string,
  options?: RequestInit,
  fallback?: T
): Promise<T | null> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      return fallback ?? null;
    }

    return (await response.json()) as T;
  } catch {
    return fallback ?? null;
  }
}

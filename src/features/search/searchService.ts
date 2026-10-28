export const searchService = {
  search: async <T>(query: string, source: T[]): Promise<T[]> => {
    const text = query.trim().toLowerCase();
    if (!text) return source;

    return source.filter((item: any) => {
      const haystack = JSON.stringify(item).toLowerCase();
      return haystack.includes(text);
    });
  }
};

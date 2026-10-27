import { resilienceCache } from './resilienceCache';
import { Movie } from '../types';
import { INITIAL_MOVIES } from '../data/mockMovies';

const API_BASE = '/api/tmdb';
const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP = 'https://image.tmdb.org/t/p/w1280';
const TMDB_LANG = 'ar-SA';

const GENRE_MAP: Record<number, string> = {
  28: 'أكشن',
  12: 'مغامرة',
  16: 'أنيميشن',
  35: 'كوميديا',
  80: 'جريمة',
  99: 'وثائقي',
  18: 'دراما',
  10751: 'عائلي',
  14: 'خيال',
  36: 'تاريخ',
  27: 'رعب',
  10402: 'موسيقى',
  9648: 'غموض',
  10749: 'رومانسي',
  878: 'خيال علمي',
  10770: 'TV Movie',
  53: 'إثارة',
  10752: 'حرب',
  37: 'غرب أمريكي'
};

export async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const cacheKey = `tmdb_${endpoint}_${JSON.stringify(params)}`;
  return resilienceCache.executeWithResilience(
    cacheKey,
    async () => {
      const url = new URL(window.location.origin + API_BASE + (endpoint.startsWith('/') ? endpoint : `/${endpoint}`));
      url.searchParams.set('language', TMDB_LANG);
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

      const res = await fetch(url.toString(), {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error(`TMDB HTTP ${res.status}`);
      return await res.json();
    },
    1000 * 60 * 60, // 1 hour TTL
    12000 // 12 second timeout
  );
}

// Map of popular known trailer YouTube keys to ensure 100% video playability
const KNOWN_TRAILERS: Record<string, string> = {
  'The Dark Knight': 'EXeTwQWrcwY',
  'فارس الظلام': 'EXeTwQWrcwY',
  'Interstellar': 'zSWdZVtXT7E',
  'بين النجوم': 'zSWdZVtXT7E',
  'Inception': 'YoHD9XEInc0',
  'بداية': 'YoHD9XEInc0',
  'Oppenheimer': 'uYPbbksJxIg',
  'أوبنهايمر': 'uYPbbksJxIg',
  'Breaking Bad': 'HhesaQXLuRY',
  'بريكنج باد': 'HhesaQXLuRY',
  'Dune: Part Two': 'Way9Dexny3w',
  'كثيب: الجزء الثاني': 'Way9Dexny3w',
  'Stranger Things': 'b9EkMc79ZSU',
  'أشياء غريبة': 'b9EkMc79ZSU',
  'Gladiator II': '4rgYUipGJNo',
  'غلاديايتر 2': '4rgYUipGJNo',
  'The Last of Us': 'uLtkt8BonwM',
  'الأخير منا': 'uLtkt8BonwM',
  'Spider-Man: Across the Spider-Verse': 'cqGjhVJWtEg',
  'سبايدر مان': 'cqGjhVJWtEg',
  'Inside Out 2': 'LEjhY15eCx0',
  'قلباً وقالباً 2': 'LEjhY15eCx0',
  'The Lion King': '4cbPBee0_24',
  'الأسد الملك': '4cbPBee0_24',
  'Kung Fu Panda 4': '_inKs4eeHiI',
  'كونغ فو باندا 4': '_inKs4eeHiI',
  'Moana 2': 'hDZ7y8RP5HE',
  'موانا 2': 'hDZ7y8RP5HE',
  'Avatar': '5PSNL1qE6VY',
  'أفاتار': '5PSNL1qE6VY',
  'Game of Thrones': 'gcTkNV5WZ1E',
  'صراع العروش': 'gcTkNV5WZ1E',
  'Pirates of the Caribbean: Dead Man\'s Chest': 'qzIM5KZuuaA',
  'قراصنة الكاريبي': 'qzIM5KZuuaA',
  'Harry Potter and the Prisoner of Azkaban': 'lAxgztbuJs8',
  'هاري بوتر': 'lAxgztbuJs8',
  'The Lord of the Rings: The Fellowship of the Ring': 'V75dMMIW2B4',
  'سائد الخواتم': 'V75dMMIW2B4'
};

const TRAILER_POOL = [
  'EXeTwQWrcwY',
  'zSWdZVtXT7E',
  'YoHD9XEInc0',
  'uYPbbksJxIg',
  'Way9Dexny3w',
  'cqGjhVJWtEg',
  'LEjhY15eCx0',
  '4cbPBee0_24',
  '_inKs4eeHiI',
  'hDZ7y8RP5HE',
  'b9EkMc79ZSU',
  'uLtkt8BonwM',
  '4rgYUipGJNo',
  'HhesaQXLuRY',
  '5PSNL1qE6VY',
  'V75dMMIW2B4',
  'lAxgztbuJs8',
  'gcTkNV5WZ1E',
  'qzIM5KZuuaA'
];

export async function fetchTMDBTrailerKey(id: number, isTv: boolean): Promise<string | undefined> {
  try {
    const endpoint = isTv ? `/tv/${id}/videos` : `/movie/${id}/videos`;
    const data = await fetchFromTMDB(endpoint, { language: 'en-US' });
    if (data?.results && data.results.length > 0) {
      const trailer = data.results.find(
        (v: any) => v.site === 'YouTube' && v.official && (v.type === 'Trailer' || v.type === 'Teaser')
      ) || data.results.find(
        (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser' || v.type === 'Clip')
      );
      if (trailer?.key) {
        return trailer.key;
      }
    }
  } catch {
    // ignore
  }
  return undefined;
}

export function formatTMDBItem(item: any, isTv: boolean = false): Movie {
  const isSeries = isTv || item.media_type === 'tv' || !!item.first_air_date;
  const title = item.title || item.name || item.original_title || 'بدون عنوان';
  const poster = item.poster_path ? `${TMDB_IMAGE}${item.poster_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=780&auto=format&fit=crop&q=80';
  const backdrop = item.backdrop_path ? `${TMDB_BACKDROP}${item.backdrop_path}` : poster;
  const rating = Number((item.vote_average || 7.5).toFixed(1));
  const year = (item.release_date || item.first_air_date || '2024').slice(0, 4);

  // Smart trailer key resolver with strict keyword matching or exact title match only
  let knownKey = KNOWN_TRAILERS[title] || KNOWN_TRAILERS[item.original_title];
  if (!knownKey) {
    const lowerTitle = (title + ' ' + (item.original_title || '')).toLowerCase();
    if (lowerTitle.includes('spider') || lowerTitle.includes('سبايدر')) knownKey = 'cqGjhVJWtEg';
    else if (lowerTitle.includes('batman') || lowerTitle.includes('dark knight') || lowerTitle.includes('باتمان') || lowerTitle.includes('فارس الظلام')) knownKey = 'EXeTwQWrcwY';
    else if (lowerTitle.includes('interstellar') || lowerTitle.includes('بين النجوم')) knownKey = 'zSWdZVtXT7E';
    else if (lowerTitle.includes('inception') || lowerTitle.includes('بداية')) knownKey = 'YoHD9XEInc0';
    else if (lowerTitle.includes('oppenheimer') || lowerTitle.includes('أوبنهايمر')) knownKey = 'uYPbbksJxIg';
    else if (lowerTitle.includes('dune') || lowerTitle.includes('كثيب')) knownKey = 'Way9Dexny3w';
    else if (lowerTitle.includes('avatar') || lowerTitle.includes('أفاتار')) knownKey = '5PSNL1qE6VY';
    else if (lowerTitle.includes('lion king') || lowerTitle.includes('الأسد الملك')) knownKey = '4cbPBee0_24';
    else if (lowerTitle.includes('moana') || lowerTitle.includes('موانا')) knownKey = 'hDZ7y8RP5HE';
    else if (lowerTitle.includes('lord of the rings') || lowerTitle.includes('سيد الخواتم')) knownKey = 'V75dMMIW2B4';
    else if (lowerTitle.includes('harry potter') || lowerTitle.includes('هاري بوتر')) knownKey = 'lAxgztbuJs8';
    else if (lowerTitle.includes('game of thrones') || lowerTitle.includes('صراع العروش')) knownKey = 'gcTkNV5WZ1E';
    else knownKey = undefined; // Strict: No random fallback video for unknown titles!
  }

  const genres = item.genre_ids && Array.isArray(item.genre_ids) && item.genre_ids.length > 0
    ? item.genre_ids.map((id: number) => GENRE_MAP[id]).filter(Boolean)
    : (isSeries ? ['مسلسلات', 'دراما', 'إثارة'] : ['أفلام', 'أكشن', 'إثارة']);

  if (genres.length === 0) {
    genres.push(isSeries ? 'دراما' : 'أكشن');
  }

  return {
    id: item.id || Math.floor(Math.random() * 100000),
    title,
    rating,
    poster,
    backdrop,
    type: isSeries ? 'مسلسل' : 'فيلم',
    year,
    videoUrl: knownKey ? `https://www.youtube-nocookie.com/embed/${knownKey}` : undefined,
    youtubeKey: knownKey,
    overview: item.overview || 'عمل سينمائي رائع يستحق المشاهدة متوفر بأعلى جودة مع الترجمة الاحترافية.',
    genres,
    duration: isSeries ? 'موسم كامل' : '2h 15m',
    matchScore: Math.min(99, Math.max(80, Math.round(rating * 10))),
    isTrending: true,
    ageRating: '16+',
    quality: '4K HDR'
  };
}

/**
 * Fetches items from TMDB in controlled batches to avoid saturating browser connection pools
 */
export async function fetchMassiveLibrary(pages: number = 6): Promise<Movie[]> {
  try {
    const allItems: Movie[] = [];
    const batchSize = 2; // 2 pages per batch = 4 concurrent requests (2 movies, 2 tv)

    for (let i = 1; i <= pages; i += batchSize) {
      const batchPromises: Promise<any>[] = [];
      for (let p = i; p < i + batchSize && p <= pages; p++) {
        batchPromises.push(fetchFromTMDB('/movie/popular', { page: p.toString() }));
        batchPromises.push(fetchFromTMDB('/tv/popular', { page: p.toString() }));
      }

      const batchResults = await Promise.allSettled(batchPromises);
      batchResults.forEach((res, index) => {
        if (res.status === 'fulfilled' && res.value?.results) {
          const isTv = index % 2 !== 0;
          allItems.push(...res.value.results.map((item: any) => formatTMDBItem(item, isTv)));
        }
      });
    }

    if (allItems.length > 0) {
      // Deduplicate
      const seen = new Set<string>();
      const deduplicated = allItems.filter(m => {
        const key = `${m.id}-${m.type}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      return deduplicated;
    }

    return INITIAL_MOVIES;
  } catch (err) {
    console.warn('Graceful catalog fallback to initial movies:', err);
    return INITIAL_MOVIES;
  }
}

export async function fetchAllMovies(): Promise<Movie[]> {
  // Fetch first 6 pages (~120 items) reliably without tripping network timeouts
  return fetchMassiveLibrary(6);
}

export async function resolveTrailerKey(movie: Movie): Promise<string | undefined> {
  if (movie.youtubeKey) return movie.youtubeKey;
  if (!movie.id) return undefined;

  try {
    const type = movie.type === 'مسلسل' ? 'tv' : 'movie';
    const data = await fetchFromTMDB(`/${type}/${movie.id}/videos`, { language: 'en-US' });
    const trailers = (data.results || []).filter(
      (v: any) => v.site === 'YouTube' && v.key && ['Trailer', 'Teaser'].includes(v.type)
    );
    const chosen = trailers.find((v: any) => v.official) || trailers[0];
    if (chosen?.key) {
      movie.youtubeKey = chosen.key;
      movie.videoUrl = `https://www.youtube-nocookie.com/embed/${chosen.key}`;
      return chosen.key;
    }
  } catch (err) {
    console.warn('Trailer resolution failed for:', movie.title);
  }

  return undefined;
}

import { Movie } from '../types';
import { filmmaxStorage } from './filmmaxStorage';

export interface CatalogSection {
  id: string;
  title: string;
  kind: 'featured' | 'trending' | 'recommended' | 'continue' | 'live';
  items: Movie[];
}

export const normalizeMovie = (
  movie: Partial<Movie> | null | undefined,
  fallbackId: string = `movie-${Date.now()}`
): Movie => {
  const safeMovie: Movie = {
    id: movie?.id ?? fallbackId,
    title: movie?.title || 'عنوان غير متاح',
    rating: movie?.rating ?? 8.5,
    poster:
      movie?.poster ||
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    type: movie?.type || 'movie',
    year: movie?.year || '2026',
    videoUrl:
      movie?.videoUrl || 'https://www.youtube-nocookie.com/embed/Way9Dexny3w',
    overview: movie?.overview || 'وصف غير متاح في الوقت الحالي.',
    genres:
      Array.isArray(movie?.genres) && movie!.genres.length > 0
        ? movie!.genres
        : ['مميز'],
    duration: movie?.duration || '2h 00m',
    matchScore: movie?.matchScore ?? 88,
    isTrending: movie?.isTrending ?? true,
    isFeatured: movie?.isFeatured ?? true,
    quality: movie?.quality || '4K HDR'
  };

  return safeMovie;
};

export const sortMoviesByScore = (
  movies: Array<Movie | null | undefined>
): Movie[] => {
  return (movies.filter(Boolean) as Movie[])
    .map((item) => normalizeMovie(item, String(item?.id ?? 'fallback-movie')))
    .sort((a, b) => Number(b.matchScore || 0) - Number(a.matchScore || 0));
};

export const getFeaturedMovies = (
  movies: Array<Movie | null | undefined>,
  limit = 10
): Movie[] => {
  return sortMoviesByScore(movies)
    .filter((item) => item.isFeatured || item.isTrending)
    .slice(0, limit);
};

export const getTrendingMovies = (
  movies: Array<Movie | null | undefined>,
  limit = 12
): Movie[] => {
  return sortMoviesByScore(movies)
    .filter((item) => item.isTrending)
    .slice(0, limit);
};

export const getRecommendedMovies = (
  movies: Array<Movie | null | undefined>,
  limit = 12
): Movie[] => {
  return sortMoviesByScore(movies).slice(0, limit);
};

export const buildCatalogSections = (
  movies: Array<Movie | null | undefined>,
  continueWatching: Movie[] = [],
  limit = 12
): CatalogSection[] => {
  const list = sortMoviesByScore(movies);

  return [
    {
      id: 'continue',
      title: 'استمرار المشاهدة',
      kind: 'continue',
      items: continueWatching.length > 0 ? continueWatching.slice(0, 6) : list.slice(0, 6)
    },
    {
      id: 'featured',
      title: 'مفصلة اليوم',
      kind: 'featured',
      items: getFeaturedMovies(list, limit)
    },
    {
      id: 'trending',
      title: 'الأكثر مشاهدة',
      kind: 'trending',
      items: getTrendingMovies(list, limit)
    },
    {
      id: 'recommended',
      title: 'مقترح لك',
      kind: 'recommended',
      items: getRecommendedMovies(list, limit)
    }
  ];
};

export const CATALOG_KEY = 'filmmax_catalog_cache_v1';

export const saveCatalogCache = (movies: Movie[]): boolean => {
  return filmmaxStorage.setItem(CATALOG_KEY, movies);
};

export const loadCatalogCache = (): Movie[] => {
  const cached = filmmaxStorage.getItem<Movie[]>(CATALOG_KEY, []);
  return Array.isArray(cached) ? cached.map((item) => normalizeMovie(item)) : [];
};

export const catalogService = {
  normalizeMovie,
  sortMoviesByScore,
  getFeaturedMovies,
  getTrendingMovies,
  getRecommendedMovies,
  buildCatalogSections,
  saveCatalogCache,
  loadCatalogCache
};

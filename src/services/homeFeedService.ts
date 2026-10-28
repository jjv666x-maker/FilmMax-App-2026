import { Movie } from '../types';
import { CatalogSection, buildCatalogSections } from './catalogService';

export interface HomeFeedSection extends CatalogSection {
  source: 'catalog' | 'recommendations' | 'live';
}

export const buildHomeFeed = ({
  movies,
  continueWatching = [],
  recommendations = [],
  liveItems = [],
  limit = 12
}: {
  movies: Array<Movie | null | undefined>;
  continueWatching?: any[];
  recommendations?: Movie[];
  liveItems?: any[];
  limit?: number;
}): HomeFeedSection[] => {
  const catalogSections = buildCatalogSections(movies, continueWatching as Movie[], limit);

  const feed: HomeFeedSection[] = [
    {
      ...catalogSections[0],
      source: 'catalog'
    },
    {
      id: 'recommendations',
      title: 'انطلاقاً من تفضيلاتك',
      kind: 'recommended',
      items:
        recommendations.length > 0
          ? recommendations.slice(0, 12)
          : catalogSections[3].items,
      source: 'recommendations'
    },
    {
      id: 'trending',
      title: 'ترند هذا الأسبوع',
      kind: 'trending',
      items: catalogSections[1].items,
      source: 'catalog'
    }
  ];

  if (liveItems.length > 0) {
    feed.push({
      id: 'live',
      title: 'قنوات البث المباشر',
      kind: 'live',
      items: liveItems.slice(0, 6) as Movie[],
      source: 'live'
    });
  }

  return feed;
};

export const homeFeedService = {
  buildHomeFeed
};

export const platformFactory = {
  buildHomeFeed
};

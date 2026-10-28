import { MediaItem } from './media';

export type FeedSectionKind =
  | 'continue'
  | 'featured'
  | 'trending'
  | 'recommended'
  | 'live'
  | 'reels';

export interface FeedSection {
  id: string;
  title: string;
  kind: FeedSectionKind;
  items: MediaItem[];
  source: 'catalog' | 'recommendations' | 'live' | 'reels';
}

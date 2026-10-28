import { MediaItem } from '../../shared/types';

export interface TasteProfile {
  genreWeights: Record<string, number>;
  totalWatchEvents: number;
}

export const buildTasteProfile = (items: MediaItem[]): TasteProfile => {
  const weights: Record<string, number> = {};
  let total = 0;

  items.forEach((item) => {
    (item.genres || []).forEach((genre) => {
      weights[genre] = (weights[genre] || 0) + 2;
      total += 2;
    });
  });

  if (total === 0) {
    weights['أكشن'] = 5;
    weights['دراما'] = 4;
    weights['خيال علمي'] = 4;
    weights['إثارة'] = 3;
    total = 16;
  }

  return {
    genreWeights: weights,
    totalWatchEvents: total
  };
};

export const calculateMatchScore = (
  item: MediaItem,
  profile: TasteProfile
): number => {
  const genres = item.genres || [];
  if (!genres.length) return 88;

  let matched = 0;
  let weighted = 0;

  genres.forEach((genre) => {
    if (profile.genreWeights[genre]) {
      weighted += profile.genreWeights[genre];
      matched += 1;
    }
  });

  const genreStrength = matched > 0 ? weighted / (genres.length * 4) : 0.3;
  const ratingFactor = Math.min(1, Math.max(0.6, (Number(item.rating) || 7.5) / 10));

  const raw = 72 + genreStrength * 18 + ratingFactor * 9;
  return Math.min(99, Math.max(79, Math.round(raw)));
};

export const enrichWithRecommendationScores = (
  items: MediaItem[],
  profile: TasteProfile
): MediaItem[] => {
  return items.map((item) => ({
    ...item,
    matchScore: calculateMatchScore(item, profile)
  }));
};

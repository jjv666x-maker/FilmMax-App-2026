/**
 * FilmMax Multi-Attribute Search & Token Indexer (Netflix Elasticsearch Architecture)
 * 
 * Features:
 * 1. Arabic & Latin Text Normalization (alif unification, tashkeel removal, case folding).
 * 2. Multi-Field Weighted Relevance Scoring (Title, Cast, Director, Genres, Overview).
 * 3. Smart Tokenization & Prefix Matching for instant keystroke results.
 */

import { Movie } from "../types";

export function normalizeArabicText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    // Remove Arabic diacritics (Tashkeel)
    .replace(/[\u064B-\u065F\u0670]/g, "")
    // Normalize Alifs: أ, إ, آ -> ا
    .replace(/[أإآ]/g, "ا")
    // Normalize Ya: ى -> ي
    .replace(/ى/g, "ي")
    // Normalize Ta Marbuta: ة -> ه
    .replace(/ة/g, "ه")
    // Remove extra punctuation
    .replace(/[.,/#!$%^&*;:{}=\-_~()?"']/g, " ")
    .replace(/\s+/g, " ");
}

export interface SearchMatchResult {
  movie: Movie;
  score: number;
  matchedField: "title" | "cast" | "genre" | "overview" | "year";
}

export function searchMoviesWithElasticIndex(
  movies: Movie[],
  query: string,
  selectedGenre: string = "الكل"
): Movie[] {
  if (!query || !query.trim()) {
    return movies.filter((m) => {
      if (selectedGenre === "الكل") return true;
      if (selectedGenre === "أفلام") return m.type === "فيلم";
      if (selectedGenre === "مسلسلات") return m.type === "مسلسل";
      if (selectedGenre === "الأعلى تقييماً") return Number(m.rating) >= 8.7;
      return (m.genres || []).includes(selectedGenre);
    });
  }

  const cleanQuery = normalizeArabicText(query);
  const queryTokens = cleanQuery.split(" ").filter((t) => t.length > 0);

  const scoredResults: SearchMatchResult[] = [];

  for (const movie of movies) {
    if (selectedGenre !== "الكل") {
      if (selectedGenre === "أفلام" && movie.type !== "فيلم") continue;
      if (selectedGenre === "مسلسلات" && movie.type !== "مسلسل") continue;
      if (selectedGenre === "الأعلى تقييماً" && Number(movie.rating) < 8.7) continue;
      if (
        selectedGenre !== "أفلام" &&
        selectedGenre !== "مسلسلات" &&
        selectedGenre !== "الأعلى تقييماً" &&
        !(movie.genres || []).includes(selectedGenre)
      ) {
        continue;
      }
    }

    const normTitle = normalizeArabicText(movie.title);
    const normOverview = normalizeArabicText(movie.overview || "");
    const normGenres = (movie.genres || []).map(normalizeArabicText);
    const castNames = (movie.cast || []).map((c) => normalizeArabicText(c.name));

    let totalScore = 0;
    let matchedField: SearchMatchResult["matchedField"] = "title";

    // 1. Exact Title Match
    if (normTitle === cleanQuery) {
      totalScore += 150;
      matchedField = "title";
    } else if (normTitle.startsWith(cleanQuery)) {
      totalScore += 100;
      matchedField = "title";
    } else if (normTitle.includes(cleanQuery)) {
      totalScore += 75;
      matchedField = "title";
    }

    // 2. Token Matching Across Fields
    for (const token of queryTokens) {
      if (normTitle.includes(token)) {
        totalScore += 40;
      }
      if (castNames.some((cast) => cast.includes(token))) {
        totalScore += 35;
        matchedField = "cast";
      }
      if (normGenres.some((g) => g.includes(token))) {
        totalScore += 30;
        matchedField = "genre";
      }
      if (movie.year && movie.year.includes(token)) {
        totalScore += 20;
        matchedField = "year";
      }
      if (normOverview.includes(token)) {
        totalScore += 15;
        matchedField = "overview";
      }
    }

    if (totalScore > 0) {
      const ratingNum = typeof movie.rating === "number" ? movie.rating : parseFloat(movie.rating) || 7.0;
      totalScore += ratingNum * 2;
      if (movie.matchScore) {
        totalScore += movie.matchScore / 10;
      }

      scoredResults.push({
        movie,
        score: totalScore,
        matchedField
      });
    }
  }

  scoredResults.sort((a, b) => b.score - a.score);
  return scoredResults.map((r) => r.movie);
}

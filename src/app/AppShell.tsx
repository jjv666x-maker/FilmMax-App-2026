import React from 'react';
import { useAppContext } from './AppProvider';

export const AppShell: React.FC = () => {
  const { movies, recommendations, isLoading } = useAppContext();

  if (isLoading) return <div className="p-8 text-white font-bold text-center">جاري التحميل...</div>;

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-black text-[#e50914]">FilmMax Shell</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-amber-400">الأكثر مشاهدة</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {movies.slice(0, 6).map((movie) => (
            <div key={String(movie.id)} className="glass-card p-3 rounded-xl border border-white/10 text-xs font-bold truncate">
              {movie.title}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-purple-400">مقترح لك</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {recommendations.slice(0, 6).map((movie) => (
            <div key={String(movie.id)} className="glass-card p-3 rounded-xl border border-white/10 text-xs font-bold truncate">
              {movie.title}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

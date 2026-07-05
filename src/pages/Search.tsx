import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

const TMDB_API_KEY = '1d9b898a212ea52e283351e521e17871';
const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

interface TMDbMovie {
  id: number;
  media_type: string;
  title?: string;
  release_date?: string;
  vote_average?: number;
  poster_path?: string | null;
  genre_ids?: number[];
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';

  const [results, setResults] = useState<TMDbMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = q ? `Search: ${q} | CINEVIDEO` : 'Search | CINEVIDEO';
  }, [q]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    async function fetchResults() {
      setLoading(true);
      setError(null);
      try {
        const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}&include_adult=false`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`TMDb error: ${res.status}`);
        const data = await res.json();
        const movies: TMDbMovie[] = (data.results ?? []).filter(
          (item: TMDbMovie) => item.media_type === 'movie'
        );
        setResults(movies);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('Failed to fetch results. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
    return () => controller.abort();
  }, [q]);

  const resolveGenre = (ids?: number[]): string => {
    if (!ids || ids.length === 0) return 'Unknown';
    return GENRE_MAP[ids[0]] ?? 'Unknown';
  };

  const resolveYear = (date?: string): string => {
    if (!date) return 'N/A';
    return date.split('-')[0];
  };

  return (
    <main className="min-h-screen bg-background pt-28 pb-16 px-4 sm:px-8 lg:px-16">
      {/* Hero heading */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-on-surface">
          Search Results for:{' '}
          <span className="text-primary">&ldquo;{q}&rdquo;</span>
        </h1>
        {!loading && !error && results.length > 0 && (
          <p className="mt-2 text-sm text-on-surface/60">
            {results.length} movie{results.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-on-surface/60 text-sm">Searching…</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex items-center justify-center py-24">
          <p className="text-red-400 text-base">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && q.trim() && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 text-on-surface/20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <p className="text-on-surface/60 text-lg">
            No movies found for <span className="text-on-surface font-semibold">&ldquo;{q}&rdquo;</span>
          </p>
          <p className="text-on-surface/40 text-sm">
            Try a different keyword or check your spelling.
          </p>
        </div>
      )}

      {/* No query state */}
      {!loading && !error && !q.trim() && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 text-on-surface/20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <p className="text-on-surface/60 text-lg">
            Start typing to search for movies.
          </p>
        </div>
      )}

      {/* Results grid */}
      {!loading && !error && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {results.map((movie) => (
            <MovieCard
              key={movie.id}
              id={String(movie.id)}
              type="movie"
              title={movie.title ?? 'Untitled'}
              year={resolveYear(movie.release_date)}
              genre={resolveGenre(movie.genre_ids)}
              rating={movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
              image={
                movie.poster_path
                  ? `${TMDB_IMG_BASE}${movie.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Image'
              }
              alt={movie.title ?? 'Movie poster'}
            />
          ))}
        </div>
      )}
    </main>
  );
}

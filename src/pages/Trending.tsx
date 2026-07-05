import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import SEO from '../components/SEO';

const TMDB_API_KEY = '1d9b898a212ea52e283351e521e17871';

export default function Trending() {
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setTrendingMovies(data.results || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getYear = (dateString: string) => dateString ? dateString.substring(0, 4) : 'N/A';
  const getImageUrl = (path: string, size: string = 'w500') => path ? `https://image.tmdb.org/t/p/${size}${path}` : '';

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">Loading Trending...</div>;
  }

  return (
    <div className="bg-background text-on-background min-h-screen">
      <SEO 
        title="Trending Movies and Shows | CINEVIDEO" 
        canonicalUrl="https://cinevideo.xyz/trending" 
      />
      <main className="pt-28 pb-16 px-4 sm:px-8 lg:px-16 max-w-container-max mx-auto">
        <section className="mb-12">
          <h1 className="font-display-sm text-display-sm mb-4 text-on-surface">Trending This Week</h1>
          <p className="text-on-surface-variant max-w-4xl text-body-lg">
            Discover the most popular movies and shows everyone is watching right now. 
            Updated daily with the latest hits across all major streaming platforms and theaters. 
            Find your next obsession below.
          </p>
        </section>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {trendingMovies.map(movie => (
            <MovieCard 
              key={movie.id}
              id={movie.id.toString()}
              type="movie"
              title={movie.title || movie.original_title}
              year={getYear(movie.release_date)}
              genre="Trending"
              rating={movie.vote_average?.toFixed(1)}
              image={getImageUrl(movie.poster_path)}
              alt={movie.title}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

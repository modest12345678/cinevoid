import { Link } from 'react-router-dom';
import { Play, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import SEO from '../components/SEO';
import { useState, useEffect } from 'react';

const TMDB_API_KEY = '1d9b898a212ea52e283351e521e17871';
const WATCHMODE_API_KEY = 'LvEi1edaOqDSY5E0URz1E1iNW8pkypCpzCWXaWD4';

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [nowPlaying, setNowPlaying] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [streamingReleases, setStreamingReleases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trendingRes, nowPlayingRes, topRatedRes, watchmodeRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}`),
          fetch(`https://api.watchmode.com/v1/releases/?apiKey=${WATCHMODE_API_KEY}`)
        ]);

        const trendingData = await trendingRes.json();
        const nowPlayingData = await nowPlayingRes.json();
        const topRatedData = await topRatedRes.json();
        const watchmodeData = await watchmodeRes.json();

        setTrendingMovies(trendingData.results || []);
        setNowPlaying(nowPlayingData.results || []);
        setTopRated(topRatedData.results || []);
        
        // Filter watchmode to movies only and limit
        const watchmodeMovies = (watchmodeData.releases || []).filter((m: any) => m.type === 'movie' && m.tmdb_id);
        setStreamingReleases(watchmodeMovies);
      } catch (err) {
        console.error("Failed to fetch from TMDb API", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">Loading CineStream...</div>;
  }

  const hero = trendingMovies[0] || {};
  const trending = trendingMovies.slice(1, 10);
  const latest = nowPlaying.slice(0, 8);
  const classics = topRated.slice(0, 10);
  const streaming = streamingReleases.slice(0, 10);

  const getYear = (dateString: string) => dateString ? dateString.substring(0, 4) : 'N/A';
  const getImageUrl = (path: string, size: string = 'w500') => path ? `https://image.tmdb.org/t/p/${size}${path}` : '';

  return (
    <div className="bg-background text-on-background">
      <SEO 
        title="CINEVIDEO — Watch Trending Movies & Anime Free"
        canonicalUrl="https://cinevideo.xyz/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "CINEVIDEO",
          "url": "https://cinevideo.xyz",
          "description": "Free online movie and anime streaming platform with thousands of titles in HD.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://cinevideo.xyz/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        }}
      />
      {/* Hero Spotlight Banner */}
      <section className="relative w-full h-[921px] md:h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${getImageUrl(hero.backdrop_path, 'original')}')` }}
        ></div>
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="relative h-full flex flex-col justify-end pb-24 px-edge-margin-mobile md:px-edge-margin-desktop max-w-container-max mx-auto">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-block px-3 py-1 mb-4 bg-primary-container/20 text-primary border border-primary-container/30 font-label-lg text-label-lg rounded-sm uppercase tracking-widest">
              Trending Now
            </span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg leading-tight mb-4 text-on-primary-container">
              {hero.title || hero.original_title}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant/90 mb-8 line-clamp-3">
              {hero.overview}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={`/watch/movie/${hero.id}`} className="flex items-center gap-3 px-8 py-4 bg-primary-container text-on-primary-container font-bold rounded-lg hover:brightness-110 transition-all active:scale-95">
                <Play className="fill-current w-6 h-6" />
                Watch Now
              </Link>
              <button className="flex items-center gap-3 px-8 py-4 bg-surface-container-high/40 backdrop-blur-md text-on-surface font-bold rounded-lg border border-outline-variant/30 hover:bg-surface-container-high/60 transition-all active:scale-95">
                <Plus className="w-6 h-6" />
                Add to List
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sliders */}
      <main className="space-y-section-gap -mt-20 relative z-10">
        
        {/* Row 1: New on Streaming (Watchmode) */}
        <section className="pl-edge-margin-mobile md:pl-edge-margin-desktop overflow-hidden">
          <div className="flex items-center justify-between pr-edge-margin-mobile md:pr-edge-margin-desktop mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3">
              New on Streaming
              <span className="w-12 h-[2px] bg-primary-container"></span>
            </h2>
            <span className="text-label-sm font-label-sm text-on-surface-variant opacity-70">
              Powered by Watchmode
            </span>
          </div>
          <div className="flex gap-gutter overflow-x-auto hide-scrollbar pb-8 pr-edge-margin-mobile md:pr-edge-margin-desktop">
            {streaming.map(movie => (
              <MovieCard 
                key={movie.id}
                id={movie.tmdb_id.toString()}
                type="movie"
                title={movie.title}
                year={getYear(movie.source_release_date)}
                genre="Streaming"
                rating={movie.source_name}
                image={movie.poster_url?.replace('w185', 'w500')}
                alt={movie.title}
                badges={['Streaming']}
              />
            ))}
          </div>
        </section>

        {/* Row 2: Trending Now */}
        <section className="pl-edge-margin-mobile md:pl-edge-margin-desktop overflow-hidden">
          <div className="flex items-center justify-between pr-edge-margin-mobile md:pr-edge-margin-desktop mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3">
              Trending Now
              <span className="w-12 h-[2px] bg-primary-container"></span>
            </h2>
            <Link to="/trending" className="text-label-lg font-label-lg text-primary-container hover:underline">
              View All
            </Link>
          </div>
          <div className="flex gap-gutter overflow-x-auto hide-scrollbar pb-8 pr-edge-margin-mobile md:pr-edge-margin-desktop">
            {trending.map(movie => (
              <MovieCard 
                key={movie.id}
                id={movie.id.toString()}
                type="movie"
                title={movie.title}
                year={getYear(movie.release_date)}
                genre="Movie"
                rating={movie.vote_average?.toFixed(1)}
                image={getImageUrl(movie.poster_path)}
                alt={movie.title}
              />
            ))}
          </div>
        </section>

        {/* Row 2: Latest Hollywood Releases (16:9 Aspect) */}
        <section className="pl-edge-margin-mobile md:pl-edge-margin-desktop overflow-hidden">
          <div className="flex items-center justify-between pr-edge-margin-mobile md:pr-edge-margin-desktop mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3">
              Epic Features
              <span className="w-12 h-[2px] bg-primary-container"></span>
            </h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex gap-gutter overflow-x-auto hide-scrollbar pb-8 pr-edge-margin-mobile md:pr-edge-margin-desktop">
            {latest.map(movie => (
              <MovieCard 
                key={movie.id}
                id={movie.id.toString()}
                type="movie"
                title={movie.title}
                year={getYear(movie.release_date)}
                genre="Movie"
                rating={movie.vote_average?.toFixed(1)}
                image={getImageUrl(movie.backdrop_path)}
                alt={movie.title}
                wide
                badges={['HD', 'New']}
              />
            ))}
          </div>
        </section>

        {/* Row 3: Action / Sci-Fi / Top Rated */}
        <section className="pl-edge-margin-mobile md:pl-edge-margin-desktop overflow-hidden">
          <div className="flex items-center justify-between pr-edge-margin-mobile md:pr-edge-margin-desktop mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3">
              Top Rated Classics
              <span className="w-12 h-[2px] bg-primary-container"></span>
            </h2>
            <Link to="/genres/action" className="text-label-lg font-label-lg text-on-surface-variant hover:text-primary transition-colors">
              Browse Genre
            </Link>
          </div>
          <div className="flex gap-gutter overflow-x-auto hide-scrollbar pb-8 pr-edge-margin-mobile md:pr-edge-margin-desktop">
            {classics.map(movie => (
              <MovieCard 
                key={movie.id}
                id={movie.id.toString()}
                type="movie"
                title={movie.title}
                year={getYear(movie.release_date)}
                genre="Movie"
                rating={movie.vote_average?.toFixed(1)}
                image={getImageUrl(movie.poster_path)}
                alt={movie.title}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

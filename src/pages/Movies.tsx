import { Link } from 'react-router-dom';
import { Play, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import SEO from '../components/SEO';
import { useState, useEffect } from 'react';

const TMDB_API_KEY = '1d9b898a212ea52e283351e521e17871';
const WATCHMODE_API_KEY = 'LvEi1edaOqDSY5E0URz1E1iNW8pkypCpzCWXaWD4';

export default function Movies() {
  const [ghibliMovies, setGhibliMovies] = useState<any[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [newlyAdded, setNewlyAdded] = useState<any[]>([]);
  const [streamingReleases, setStreamingReleases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [ghibliRes, trendingRes, newlyAddedRes, watchmodeRes] = await Promise.all([
          fetch('https://ghibliapi.vercel.app/films'),
          fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}`),
          fetch(`https://api.watchmode.com/v1/releases/?apiKey=${WATCHMODE_API_KEY}`)
        ]);

        const ghibliData = await ghibliRes.json();
        const trendingData = await trendingRes.json();
        const newlyAddedData = await newlyAddedRes.json();
        const watchmodeData = await watchmodeRes.json();

        setGhibliMovies(ghibliData || []);
        setTrendingMovies(trendingData.results || []);
        setNewlyAdded(newlyAddedData.results || []);
        
        // Filter watchmode to movies only
        const watchmodeMovies = (watchmodeData.releases || []).filter((m: any) => m.type === 'movie' && m.tmdb_id);
        setStreamingReleases(watchmodeMovies);
      } catch (err) {
        console.error("Failed to fetch movies", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">Loading Movies...</div>;
  }

  const hero = ghibliMovies[0] || {};
  const ghibliList = ghibliMovies.slice(1, 10);
  const trendingList = trendingMovies.slice(0, 10);
  const latestList = newlyAdded.slice(0, 8);
  const streamingList = streamingReleases.slice(0, 10);

  const getYear = (dateString: string) => dateString ? dateString.substring(0, 4) : 'N/A';
  const getTmdbImage = (path: string, size: string = 'w500') => path ? `https://image.tmdb.org/t/p/${size}${path}` : '';

  return (
    <div className="bg-background text-on-background">
      <SEO 
        title="Free Movies to Watch Online | CINEVIDEO"
        canonicalUrl="https://cinevideo.xyz/movies"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cinevideo.xyz/" },
            { "@type": "ListItem", "position": 2, "name": "Movies", "item": "https://cinevideo.xyz/movies" }
          ]
        }}
      />
      {/* Hero Spotlight Banner - Using Ghibli */}
      <section className="relative w-full h-[921px] md:h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${hero.movie_banner || hero.image}')` }}
        ></div>
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="relative h-full flex flex-col justify-end pb-24 px-edge-margin-mobile md:px-edge-margin-desktop max-w-container-max mx-auto">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-block px-3 py-1 mb-4 bg-primary-container/20 text-primary border border-primary-container/30 font-label-lg text-label-lg rounded-sm uppercase tracking-widest">
              Studio Ghibli Spotlight
            </span>
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg leading-tight mb-4 text-on-primary-container">
              {hero.title}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant/90 mb-8 line-clamp-3">
              {hero.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={`/watch/ghibli/${hero.id}`} className="flex items-center gap-3 px-8 py-4 bg-primary-container text-on-primary-container font-bold rounded-lg hover:brightness-110 transition-all active:scale-95">
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
      <main className="relative z-10 bg-background">
        
        {/* SEO Page Intro */}
        <section className="px-edge-margin-mobile md:px-edge-margin-desktop pt-16 pb-8 max-w-container-max mx-auto">
          <h1 className="font-display-sm text-headline-lg md:text-display-sm mb-4 text-on-surface">Free Movies to Watch Online</h1>
          <p className="text-on-surface-variant max-w-4xl text-body-lg">
            Welcome to CINEVIDEO's ultimate movie collection. Whether you're looking for the latest Hollywood blockbusters, 
            indie gems, or timeless classics, you'll find them all here ready to stream. Browse our curated lists by genre, 
            release year, and popularity to discover your next favorite film. Watch free movies online in HD and 4K with no 
            sign-up required, and dive straight into an immersive cinematic experience.
          </p>
        </section>

        <div className="space-y-section-gap pt-8">
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
            {streamingList.map(movie => (
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

        {/* Row 2: Studio Ghibli */}
        <section className="pl-edge-margin-mobile md:pl-edge-margin-desktop overflow-hidden">
          <div className="flex items-center justify-between pr-edge-margin-mobile md:pr-edge-margin-desktop mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3">
              Studio Ghibli Classics
              <span className="w-12 h-[2px] bg-primary-container"></span>
            </h2>
            <Link to="/ghibli" className="text-label-lg font-label-lg text-primary-container hover:underline">
              View All
            </Link>
          </div>
          <div className="flex gap-gutter overflow-x-auto hide-scrollbar pb-8 pr-edge-margin-mobile md:pr-edge-margin-desktop">
            {ghibliList.map(movie => (
              <MovieCard 
                key={movie.id}
                id={movie.id.toString()}
                type="ghibli"
                title={movie.title}
                year={movie.release_date}
                genre="Animation, Fantasy"
                rating={movie.rt_score ? `${movie.rt_score}%` : 'N/A'}
                image={movie.image}
                alt={movie.title}
              />
            ))}
          </div>
        </section>

        {/* Row 2: Trending Now (TMDb) */}
        <section className="pl-edge-margin-mobile md:pl-edge-margin-desktop overflow-hidden">
          <div className="flex items-center justify-between pr-edge-margin-mobile md:pr-edge-margin-desktop mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3">
              Trending Now
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
            {trendingList.map(movie => (
              <MovieCard 
                key={movie.id}
                id={movie.id.toString()}
                type="movie"
                title={movie.title}
                year={getYear(movie.release_date)}
                genre="Movie"
                rating={movie.vote_average?.toFixed(1)}
                image={getTmdbImage(movie.backdrop_path)}
                alt={movie.title}
                wide
                badges={['Trending']}
              />
            ))}
          </div>
        </section>

        {/* Row 3: Newly Added (TMDb) */}
        <section className="pl-edge-margin-mobile md:pl-edge-margin-desktop overflow-hidden">
          <div className="flex items-center justify-between pr-edge-margin-mobile md:pr-edge-margin-desktop mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3">
              Newly Added
              <span className="w-12 h-[2px] bg-primary-container"></span>
            </h2>
          </div>
          <div className="flex gap-gutter overflow-x-auto hide-scrollbar pb-8 pr-edge-margin-mobile md:pr-edge-margin-desktop">
            {latestList.map(movie => (
              <MovieCard 
                key={movie.id}
                id={movie.id.toString()}
                type="movie"
                title={movie.title}
                year={getYear(movie.release_date)}
                genre="Movie"
                rating={movie.vote_average?.toFixed(1)}
                image={getTmdbImage(movie.poster_path)}
                alt={movie.title}
              />
            ))}
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}

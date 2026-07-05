import { Link } from 'react-router-dom';
import { Play, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import SEO from '../components/SEO';
import { useState, useEffect } from 'react';

export default function Anime() {
  const [topAnime, setTopAnime] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.jikan.moe/v4/top/anime?limit=24')
      .then(res => res.json())
      .then(data => {
        setTopAnime(data.data || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch from Jikan", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">Loading CineStream...</div>;
  }

  const hero = topAnime[0] || {};
  const trending = topAnime.slice(1, 7);
  const latest = topAnime.slice(7, 9);
  const action = topAnime.slice(9, 15);

  const getGenres = (anime: any) => anime.genres?.map((g: any) => g.name).join(', ') || 'Anime';
  const getYear = (anime: any) => anime.year || (anime.aired?.prop?.from?.year) || 'N/A';

  return (
    <div className="bg-background text-on-background">
      <SEO 
        title="Watch Top Anime & Studio Ghibli Classics Free | CINEVIDEO"
        canonicalUrl="https://cinevoid.pages.dev/anime"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cinevoid.pages.dev/" },
            { "@type": "ListItem", "position": 2, "name": "Anime", "item": "https://cinevoid.pages.dev/anime" }
          ]
        }}
      />
      {/* Hero Spotlight Banner */}
      <section className="relative w-full h-[921px] md:h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${hero.trailer?.images?.maximum_image_url || hero.images?.jpg?.large_image_url}')` }}
        ></div>
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="relative h-full flex flex-col justify-end pb-24 px-edge-margin-mobile md:px-edge-margin-desktop max-w-container-max mx-auto">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-block px-3 py-1 mb-4 bg-primary-container/20 text-primary border border-primary-container/30 font-label-lg text-label-lg rounded-sm uppercase tracking-widest">
              Trending Now
            </span>
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg leading-tight mb-4 text-on-primary-container">
              {hero.title_english || hero.title}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant/90 mb-8 line-clamp-3">
              {hero.synopsis}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={`/watch/anime/${hero.mal_id}`} className="flex items-center gap-3 px-8 py-4 bg-primary-container text-on-primary-container font-bold rounded-lg hover:brightness-110 transition-all active:scale-95">
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
          <h1 className="font-display-sm text-headline-lg md:text-display-sm mb-4 text-on-surface">Watch Anime & Studio Ghibli Classics Free</h1>
          <p className="text-on-surface-variant max-w-4xl text-body-lg">
            Explore our vast library of top-rated anime, including trending series, beloved Studio Ghibli classics, 
            and epic action adventures. Whether you're a lifelong otaku or just discovering anime, we have everything 
            from shounen masterpieces to slice-of-life gems. Stream your favorite anime completely free, in high quality, 
            with no sign-up or subscription required. 
          </p>
        </section>

        <div className="space-y-section-gap pt-8">
        {/* Row 1: Trending Now */}
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
            {trending.map(anime => (
              <MovieCard 
                key={anime.mal_id}
                type="anime"
                id={anime.mal_id.toString()}
                title={anime.title_english || anime.title}
                year={getYear(anime).toString()}
                genre={getGenres(anime)}
                rating={anime.score?.toString()}
                image={anime.images?.jpg?.large_image_url}
                alt={anime.title}
              />
            ))}
          </div>
        </section>

        {/* Row 2: Latest Hollywood Releases (16:9 Aspect) */}
        <section className="pl-edge-margin-mobile md:pl-edge-margin-desktop overflow-hidden">
          <div className="flex items-center justify-between pr-edge-margin-mobile md:pr-edge-margin-desktop mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3">
              Latest Releases
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
            {latest.map(anime => (
              <MovieCard 
                key={anime.mal_id}
                type="anime"
                id={anime.mal_id.toString()}
                title={anime.title_english || anime.title}
                year={getYear(anime).toString()}
                genre={getGenres(anime)}
                rating={anime.score?.toString()}
                image={anime.trailer?.images?.maximum_image_url || anime.images?.jpg?.large_image_url}
                alt={anime.title}
                wide
                badges={['HD', anime.type]}
              />
            ))}
          </div>
        </section>

        {/* Row 3: Action / Sci-Fi */}
        <section className="pl-edge-margin-mobile md:pl-edge-margin-desktop overflow-hidden">
          <div className="flex items-center justify-between pr-edge-margin-mobile md:pr-edge-margin-desktop mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3">
              Action / Sci-Fi
              <span className="w-12 h-[2px] bg-primary-container"></span>
            </h2>
            <Link to="/genres/action" className="text-label-lg font-label-lg text-on-surface-variant hover:text-primary transition-colors">
              Browse Genre
            </Link>
          </div>
          <div className="flex gap-gutter overflow-x-auto hide-scrollbar pb-8 pr-edge-margin-mobile md:pr-edge-margin-desktop">
            {action.map(anime => (
              <MovieCard 
                key={anime.mal_id}
                type="anime"
                id={anime.mal_id.toString()}
                title={anime.title_english || anime.title}
                year={getYear(anime).toString()}
                genre={getGenres(anime)}
                rating={anime.score?.toString()}
                image={anime.images?.jpg?.large_image_url}
                alt={anime.title}
              />
            ))}
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}

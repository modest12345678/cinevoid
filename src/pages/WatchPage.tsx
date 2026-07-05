import { Link, useParams } from 'react-router-dom';
import { 
  ChevronRight, ShoppingCart, Play, Database, Zap, Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';

const TMDB_API_KEY = '1d9b898a212ea52e283351e521e17871';

export default function WatchPage() {
  const { type, id } = useParams();
  const [data, setData] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAnime = type === 'anime';
  const isGhibli = type === 'ghibli';
  const isTmdb = type === 'movie';

  useEffect(() => {
    setIsLoading(true);
    
    // Determine which API to call based on the route parameter
    let url = '';
    if (isAnime) url = `https://api.jikan.moe/v4/anime/${id}`;
    else if (isGhibli) url = `https://ghibliapi.vercel.app/films/${id}`;
    else url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`;

    fetch(url)
      .then(res => res.json())
      .then(resData => {
        setData(isAnime ? resData.data : resData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch", err);
        setIsLoading(false);
      });
      
    // Fetch Watchmode sources if TMDB ID is available
    if (isTmdb && id) {
      const watchmodeUrl = `https://api.watchmode.com/v1/title/movie-${id}/sources/?apiKey=LvEi1edaOqDSY5E0URz1E1iNW8pkypCpzCWXaWD4`;
      fetch(watchmodeUrl)
        .then(res => res.json())
        .then(sourceData => {
          if (Array.isArray(sourceData)) {
            // Filter and deduplicate sources by name
            const uniqueSources = sourceData.reduce((acc: any[], current: any) => {
              const x = acc.find(item => item.name === current.name);
              if (!x && current.type === 'sub') {
                return acc.concat([current]);
              } else {
                return acc;
              }
            }, []);
            setSources(uniqueSources);
          }
        })
        .catch(err => console.error("Failed to fetch Watchmode sources", err));
    }
  }, [id, type]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">Loading details...</div>;
  }

  if (!data || data.error || data.message || (data.success === false)) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">Not Found</div>;
  }

  // Parse fields based on API source
  const title = isAnime 
    ? (data.title_english || data.title) 
    : isGhibli 
      ? data.title 
      : (data.title || data.original_title);
      
  const year = isAnime 
    ? (data.year || (data.aired?.prop?.from?.year) || 'N/A')
    : isGhibli
      ? data.release_date
      : (data.release_date ? data.release_date.substring(0, 4) : 'N/A');
  
  // Find official trailer for TMDb
  const tmdbTrailer = isTmdb && data.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
  
  const embedUrl = isAnime 
    ? (data.trailer?.embed_url || `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(title + ' official trailer')}`)
    : isGhibli
      ? `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(title + ' official trailer')}`
      : (tmdbTrailer 
          ? `https://www.youtube.com/embed/${tmdbTrailer.key}` 
          : `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(title + ' official trailer')}`);
  
  const image = isAnime 
    ? data.images?.jpg?.large_image_url 
    : isGhibli
      ? data.image
      : (data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '');
    
  const score = isAnime 
    ? `${data.score} MyAnimeList` 
    : isGhibli
      ? `${data.rt_score}% Rotten Tomatoes`
      : `${data.vote_average?.toFixed(1)} TMDb`;
      
  const duration = isAnime 
    ? data.duration 
    : isGhibli
      ? `${data.running_time}m`
      : `${data.runtime}m`;
      
  const rating = isAnime 
    ? data.rating 
    : isGhibli
      ? 'PG'
      : (data.adult ? 'R' : 'PG-13');
      
  const genres = isAnime 
    ? data.genres?.map((g: any) => g.name).join(', ') 
    : isGhibli
      ? 'Animation, Fantasy'
      : data.genres?.map((g: any) => g.name).join(', ');
  
  const synopsis = isAnime 
    ? data.synopsis 
    : isGhibli
      ? data.description
      : data.overview;
  
  const creatorField = isAnime 
    ? { label: 'Studios', value: data.studios?.map((s: any) => s.name).join(', ') || 'N/A' }
    : isGhibli
      ? { label: 'Director', value: data.director }
      : { label: 'Director', value: data.credits?.crew?.find((c: any) => c.job === 'Director')?.name || 'N/A' };
    
  const typeLabel = isAnime ? 'Anime' : 'Movies';
  const typeUrl = isAnime ? '/anime' : '/movies';

  return (
    <main className="pt-24 pb-section-gap max-w-container-max mx-auto px-edge-margin-desktop">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 text-on-surface-variant font-label-lg text-label-lg">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={typeUrl} className="hover:text-primary transition-colors">{typeLabel}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-on-surface capitalize truncate max-w-xs">{title} ({year})</span>
      </nav>

      {/* Top Banner Ad (728x90) */}
      <div className="w-full flex justify-center mb-8 relative">
        <div className="w-full max-w-[728px] h-[90px] bg-surface-container-low border border-outline-variant flex flex-col items-center justify-center text-on-surface-variant relative overflow-hidden group rounded">
          <span className="font-label-sm text-label-sm opacity-50 absolute top-1 right-2 uppercase tracking-widest">Advertisement</span>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-container/20 rounded flex items-center justify-center">
              <ShoppingCart className="text-primary w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-on-surface">Upgrade to CINEVIDEO Pro</p>
              <p className="text-sm opacity-70">Watch without interruptions. Try 7 days free.</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-primary-container/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* Video Player Section */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Player Area (Left/Main) */}
        <div className="col-span-12 lg:col-span-10">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden group shadow-2xl">
            {/* Embedded open platform video iframe */}
            <iframe 
              className="w-full h-full"
              src={embedUrl} 
              allow="autoplay; fullscreen; encrypted-media" 
              allowFullScreen
              title="Video Player"
              frameBorder="0"
            ></iframe>
          </div>
        </div>

        {/* Server Sidebar (Right) */}
        <div className="col-span-12 lg:col-span-2 flex flex-col gap-gutter">
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-4 border border-outline-variant/30">
            <h3 className="font-headline-md text-headline-md text-sm uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <Database className="w-4 h-4" /> Available On
            </h3>
            <div className="flex flex-col gap-2">
              {sources.length > 0 ? (
                sources.map((source, index) => (
                  <a 
                    key={index}
                    href={source.web_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-3 rounded-lg border border-outline-variant hover:border-secondary transition-all bg-surface hover:bg-surface-container-high group"
                  >
                    <div className="flex items-center gap-3 text-on-surface">
                      <Zap className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:text-secondary fill-current" />
                      <span className="font-label-lg">{source.name}</span>
                    </div>
                    <span className="text-[10px] text-on-surface opacity-40 group-hover:opacity-100 font-bold uppercase">{source.format}</span>
                  </a>
                ))
              ) : (
                <div className="text-sm text-on-surface-variant text-center py-4 opacity-70">
                  {isTmdb ? "No streaming sources found." : "Streaming info not available."}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Ad (300x250) */}
          <div className="w-full aspect-[6/5] bg-surface-container-low border border-outline-variant flex flex-col items-center justify-center p-4 text-center group relative overflow-hidden rounded-xl">
            <span className="font-label-sm text-label-sm opacity-50 absolute top-1 right-2 uppercase tracking-widest">Ad</span>
            <div className="p-3 bg-secondary/10 rounded-full mb-3 text-secondary">
              <Shield className="w-10 h-10" />
            </div>
            <p className="font-bold text-sm text-on-surface mb-1">Stay Anonymous</p>
            <p className="text-xs text-on-surface-variant mb-4">Protect your streaming with CINEVIDEO VPN.</p>
            <button className="w-full py-2 bg-secondary text-on-secondary font-bold text-xs rounded uppercase tracking-wider hover:opacity-90 transition-opacity">Get 80% Off</button>
          </div>
        </div>
      </div>

      {/* Metadata Section */}
      <section className="mt-row-gap grid grid-cols-12 gap-gutter bg-surface-container-low p-8 rounded-2xl border border-outline-variant/20">
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <div className="w-full aspect-[2/3] rounded-lg overflow-hidden shadow-2xl relative group bg-black/20">
            {image && (
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src={image} 
                alt={title} 
              />
            )}
          </div>
        </div>
        <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col gap-6">
          <div>
            <h1 className="font-display-lg text-headline-lg lg:text-display-lg-mobile text-on-surface mb-2 capitalize">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-label-lg">
              <span className="flex items-center gap-1 text-primary-container font-bold"><Play className="w-4 h-4 fill-current"/> {score}</span>
              <span>{year}</span>
              <span>{duration}</span>
              <span className="border border-outline-variant px-2 py-0.5 rounded text-xs">{rating}</span>
              <span>{genres}</span>
            </div>
          </div>
          <p className="font-body-lg text-on-surface-variant/90 leading-relaxed max-w-4xl">
            {synopsis}
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <p><span className="text-on-surface-variant opacity-70">{creatorField.label}:</span> <span className="text-on-surface font-medium">{creatorField.value}</span></p>
            {isGhibli && (
              <p><span className="text-on-surface-variant opacity-70">Producer:</span> <span className="text-on-surface font-medium">{data.producer}</span></p>
            )}
            {isTmdb && data.production_companies && (
              <p><span className="text-on-surface-variant opacity-70">Producer:</span> <span className="text-on-surface font-medium">{data.production_companies.map((p: any) => p.name).join(', ')}</span></p>
            )}
            {isAnime && (
              <p><span className="text-on-surface-variant opacity-70">Status:</span> <span className="text-on-surface font-medium">{data.status}</span></p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

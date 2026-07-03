import { Link } from 'react-router-dom';

interface MovieCardProps {
  id: string | number;
  type: 'movie' | 'anime' | 'ghibli';
  title: string;
  year: string;
  genre: string;
  rating: string;
  image: string;
  alt: string;
  wide?: boolean;
  badges?: string[];
}

export default function MovieCard({ id, type, title, year, genre, rating, image, alt, wide = false, badges = [] }: MovieCardProps) {
  if (wide) {
    return (
      <Link to={`/watch/${type}/${id}`} className="flex-none w-[320px] md:w-[450px] group cursor-pointer block">
        <div className="movie-card-zoom relative aspect-video bg-surface-container rounded-xl overflow-hidden mb-3">
          <img className="w-full h-full object-cover" data-alt={alt} src={image} alt={title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
            <div className="flex items-center gap-3 mb-2">
              {badges.map((badge, idx) => (
                <span key={idx} className={`${idx === 0 ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface'} text-[10px] font-bold px-2 py-0.5 rounded uppercase`}>
                  {badge}
                </span>
              ))}
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/watch/${type}/${id}`} className="flex-none w-48 md:w-56 group cursor-pointer block">
      <div className="movie-card-zoom relative aspect-[2/3] bg-surface-container rounded-lg overflow-hidden mb-3">
        <img className="w-full h-full object-cover" data-alt={alt} src={image} alt={title} />
        {rating && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <p className="font-label-lg text-label-lg text-on-primary-container">{rating} ★ IMDb</p>
          </div>
        )}
      </div>
      <h3 className="font-label-lg text-label-lg text-on-surface group-hover:text-primary transition-colors truncate">{title}</h3>
      {year && genre && (
        <p className="text-label-sm font-label-sm text-on-surface-variant">{year} • {genre}</p>
      )}
    </Link>
  );
}

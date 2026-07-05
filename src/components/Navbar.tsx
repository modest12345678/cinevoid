import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useState, useRef } from 'react';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-500" id="main-nav" aria-label="Main navigation">
      <div className="flex items-center justify-between px-edge-margin-desktop h-20 max-w-container-max mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3 font-display-lg text-headline-md font-extrabold tracking-tighter text-primary-container dark:text-primary-container" aria-label="CINEVIDEO Home">
            <img src="/logo.png" alt="CINEVIDEO Logo" className="w-8 h-8 rounded" />
            CINEVIDEO
          </Link>
          <div className="hidden md:flex items-center gap-8" role="menubar">
            <Link to="/" className="text-primary-container font-bold border-b-2 border-primary-container pb-1 font-label-lg text-label-lg hover:text-primary transition-colors duration-300" role="menuitem">
              Trending
            </Link>
            <Link to="/movies" className="text-on-surface-variant font-medium pb-1 font-label-lg text-label-lg hover:text-primary transition-colors duration-300" role="menuitem">
              Movies
            </Link>
            <Link to="/anime" className="text-on-surface-variant font-medium pb-1 font-label-lg text-label-lg hover:text-primary transition-colors duration-300" role="menuitem">
              Anime
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <form onSubmit={handleSearch} role="search" className="relative hidden lg:block">
            <label htmlFor="site-search" className="sr-only">Search movies and anime</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 pointer-events-none" aria-hidden="true" />
            <input
              id="site-search"
              ref={inputRef}
              className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-on-surface w-64 focus:ring-1 focus:ring-primary-container text-body-md font-body-md transition-all"
              placeholder="Search movies, anime..."
              type="search"
              autoComplete="off"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </form>
          {/* Mobile search icon */}
          <Link to="/search" className="lg:hidden text-on-surface-variant hover:text-primary transition-all active:scale-95" aria-label="Search">
            <Search className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

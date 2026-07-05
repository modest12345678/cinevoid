import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full mt-section-gap bg-surface-container-lowest dark:bg-surface-container-lowest flex flex-col items-center gap-gutter py-row-gap px-edge-margin-mobile md:px-edge-margin-desktop border-t border-outline-variant" aria-label="Site footer">
      <div className="max-w-container-max w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4 max-w-xs">
          <Link to="/" className="font-display-lg text-headline-sm font-bold text-primary-container" aria-label="CINEVIDEO Home">
            CINEVIDEO
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Your free streaming destination for trending movies, top-rated anime, and Studio Ghibli classics. No sign-up. No subscription. Just cinema.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          <nav aria-label="Browse content">
            <h4 className="font-label-lg text-label-lg text-on-surface uppercase tracking-widest mb-2">Browse</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">Trending</Link></li>
              <li><Link to="/movies" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">Movies</Link></li>
              <li><Link to="/anime" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">Anime</Link></li>
              <li><Link to="/search" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">Search</Link></li>
            </ul>
          </nav>
          <nav aria-label="Legal information">
            <h4 className="font-label-lg text-label-lg text-on-surface uppercase tracking-widest mb-2">Legal</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/dmca" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">DMCA</Link></li>
              <li><Link to="/privacy" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">Terms of Service</Link></li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="max-w-container-max w-full pt-8 border-t border-outline-variant/30 text-center">
        <p className="font-label-sm text-label-sm text-on-surface-variant opacity-60">
          © {new Date().getFullYear()} CINEVIDEO. All rights reserved. &nbsp;|&nbsp; DMCA Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.
        </p>
      </div>
    </footer>
  );
}

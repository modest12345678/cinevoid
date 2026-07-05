import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Anime from './pages/Anime';
import Trending from './pages/Trending';
import WatchPage from './pages/WatchPage';
import Search from './pages/Search';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import DMCA from './pages/DMCA';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/search" element={<Search />} />
            <Route path="/watch/:type/:id" element={<WatchPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/dmca" element={<DMCA />} />
            {/* Catch-all 404 redirect to home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

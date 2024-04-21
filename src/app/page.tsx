"use client";
import { useState, useEffect } from "react";
import {Link} from 'next-view-transitions'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  backdrop_path: string;

}

interface HomeProps {
  nowPlaying: Movie[];
  popular: Movie[];
}

async function fetchMovies(apiKey: string) {
  const [nowPlayingResponse, popularResponse] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`),
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`),
    fetch(`https://api.themoviedb.org/3/movie/?api_key=${apiKey}`),
  ]);

  const [nowPlayingData, popularData] = await Promise.all([
    nowPlayingResponse.json(),
    popularResponse.json(),
  ]);

  return {
    nowPlaying: nowPlayingData.results,
    popular: popularData.results,
  };
}

export default function Home() {
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [filteredNowPlaying, setFilteredNowPlaying] = useState<Movie[]>([]);
  const [filteredPopular, setFilteredPopular] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = process.env.MOVIE_API_KEY ?? '';
      const { nowPlaying, popular } = await fetchMovies(apiKey);
      setNowPlaying(nowPlaying || []);
      setPopular(popular || []);
      setFilteredNowPlaying(nowPlaying || []);
      setFilteredPopular(popular || []);
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredNP = nowPlaying.filter(movie =>
      movie.title.toLowerCase().includes(query)
    );
    const filteredP = popular.filter(movie =>
      movie.title.toLowerCase().includes(query)
    );

    setFilteredNowPlaying(filteredNP);
    setFilteredPopular(filteredP);
  };



  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100">
      <header className="bg-gray-900 py-6 sticky top-0 z-10">
          <div className="container px-4 md:px-6 mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <FilmIcon className="w-6 h-6 text-white " />
              <span className="ml-2 text-white font-semibold ">MovieECM</span>
            </div>
            <div className="relative">
              <Input
                className="bg-gray-800 text-white rounded-full py-2 pl-4 pr-10"
                placeholder="Search movies..."
                type="search"
                value={searchQuery}
                onChange={handleSearch}
              />
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>
        <section className="py-8 md:py-12">
  <div className="container px-4 md:px-6 mx-auto">
  {filteredNowPlaying.length > 0 && (
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="md:w-1/2 lg:w-2/3 mb-8 md:mb-0">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{nowPlaying[0].title}</h2>
          <p className="text-gray-600 mb-6">{nowPlaying[0].overview}</p>
          <div className="aspect-w-16 aspect-h-9">
            <img
              alt={nowPlaying[0].title}
              className="rounded-lg object-cover"
              src={`https://image.tmdb.org/t/p/w1280${nowPlaying[0].backdrop_path}`}
            />
          </div>
        </div>
        <div className="md:w-1/2 lg:w-1/3 md:pl-8">
          <h3 className="text-xl md:text-2xl font-bold mb-2">{nowPlaying[0].title}</h3>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={`w-4 h-4 ${
                  index < Math.floor(nowPlaying[0].vote_average / 2) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-gray-600">{nowPlaying[0].vote_average.toFixed(1)}</span>
          </div>
          <p className="text-gray-600 mb-6">{nowPlaying[0].overview}</p>
          
        </div>
      </div>
    )}
  </div>
</section>

<section className="py-8 md:py-12 bg-white">
  <div className="container px-4 md:px-6 mx-auto">
    <h2 className="text-xl md:text-2xl font-bold mb-6">Popular Movies</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    {filteredPopular.map((movie) => (
        <div key={movie.id} className="relative group">
          <Link className="absolute inset-0 z-10" href={`/movie/${movie.id}`}>
            <span className="sr-only">View</span>
          </Link>
          <img
            alt={movie.title}
            className="rounded-lg object-cover w-full aspect-[2/3]"
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent rounded-b-lg">
            <h3 className="text-white font-semibold">{movie.title}</h3>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.floor(movie.vote_average / 2) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-200">{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
      <footer className="bg-gray-900 text-white py-4 text-center w-full">
        <div className="container px-4 md:px-6 mx-auto">
          <p>&copy; 2024 MovieECM.</p>
        </div>
      </footer>
      </main>
    </div>
  );
};



function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function FilmIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18" />
      <path d="M3 7.5h4" />
      <path d="M3 12h18" />
      <path d="M3 16.5h4" />
      <path d="M17 3v18" />
      <path d="M17 7.5h4" />
      <path d="M17 16.5h4" />
    </svg>
  );
}

function FlameIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
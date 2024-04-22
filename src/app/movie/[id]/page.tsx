"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  backdrop_path: string;
  release_date: string;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

async function fetchMovie(id: string, apiKey: string) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
  const movie = await response.json();
  return movie;
}

async function fetchMovieCast(id: string, apiKey: string) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`);
  const credits = await response.json();
  return credits.cast;
}

export default function MovieDetails() {
  const params = useParams();
  const id = params.id as string;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const apiKey = process.env.NEXT_PUBLIC_MOVIE_API_KEY!;
        const movieData = await fetchMovie(id, apiKey);
        const castData = await fetchMovieCast(id, apiKey);
        setMovie(movieData);
        setCast(castData);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Movie not found.</div>;
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100">
        <header className="bg-gray-900 py-6 sticky top-0 z-10">
          <div className="container px-4 md:px-6 mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <FilmIcon className="w-6 h-6 text-white" />
              <span className="ml-2 text-white font-semibold">MovieECM</span>
            </div>
            <div className="relative">
              <Input
                className="bg-gray-800 text-white rounded-full py-2 pl-4 pr-10"
                placeholder="Search movies..."
                type="search"
              />
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>
        <div className="container px-4 md:px-6 mx-auto py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="md:w-1/2 lg:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h2>
              <p className="text-gray-600 mb-6">{movie.overview}</p>
              <div className="aspect-w-16 aspect-h-9">
                <img
                  alt={movie.title}
                  className="rounded-lg object-cover"
                  src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                />
              </div>
              <Link href="/" className="gap-4">
                <Button className="mt-8">Back to Home</Button>
             </Link>
            </div>
            <div className="mt-8 md:mt-0 md:ml-8 lg:ml-16">
              <h3 className="text-2xl font-bold mb-2">{movie.title}</h3>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className={`w-4 h-4 ${
                      index < Math.floor(movie.vote_average / 2) ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600">{movie.vote_average}</span>
              </div>
              <p className="text-gray-600 mb-6 font-semibold"> Release date : {movie.release_date}</p>

              <h4 className="text-xl font-bold mb-4">Cast</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {cast.map((member) => (
                  <div key={member.id} className="flex flex-col items-center">
                    {member.profile_path ? (
                      <img
                        alt={member.name}
                        className="rounded-full w-20 h-20 object-cover mb-2"
                        src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-full mb-2" />
                    )}
                    <p className="text-center text-sm font-medium">{member.name}</p>
                    <p className="text-center text-xs text-gray-500">{member.character}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
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
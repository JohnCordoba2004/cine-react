import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import type { Peli } from "./types";

function App() {
  const [search, setSearch] = useState("");
  const [movie, setMovie] = useState<Peli[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Peli | null>(null);

  useEffect(() => {
    //1. Temporizador creado
    const timer = setTimeout(async () => {
      try {
        if (search.length >= 3) {
          const urlSearch = `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${search}&language=es-MX&page=1`;
          const response = await fetch(urlSearch);
          if (!response.ok) throw new Error("Error al buscar");
          const data = await response.json();
          setMovie(data.results);
          console.log(data.results);
        } else if (search.length === 0) {
          const urlPopular = `https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=es-MX&page=1`;
          const response = await fetch(urlPopular);
          if (!response.ok) throw new Error("Error al buscar");
          const data = await response.json();
          setMovie(data.results);
          console.log(data.results);
        }
      } catch (error) {
        console.error("Error al cargar la api", error);
      }
    }, 500);
    // 2. Función de limpieza (mata el temporizador anterior si el usuario sigue escribiendo)
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-emerald-400">
        Cartelera React
      </h1>

      <SearchBar search={search} setSearch={setSearch}></SearchBar>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6  mt-10">
        {movie.map((peli) => (
          <MovieCard
            key={peli.id}
            pelicula={peli}
            onSelect={setSelectedMovie}
          />
        ))}
      </div>

      {selectedMovie && (
        <MovieModal
          pelicula={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
      <p>Estás buscando: {search}</p>
    </main>
  );
}

export default App;

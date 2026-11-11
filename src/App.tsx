import { useEffect, useState, useRef } from "react";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import type { Peli } from "./types";
import { Header } from "./components/Navbar";
import { Hero } from "./components/Hero";

function App() {
  const [search, setSearch] = useState("");
  const [movie, setMovie] = useState<Peli[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Peli | null>(null);
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const carruselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        if (search.length >= 3) {
          const urlSearch = `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${search}&language=es-MX&page=${page}`;
          const response = await fetch(urlSearch);
          if (!response.ok) throw new Error("Error al buscar");
          const data = await response.json();
          setMovie(data.results);
          setTotalPages(data.total_pages)
        } else if (search.length === 0) {
          const urlPopular = `https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=es-MX&page=${page}`;
          const response = await fetch(urlPopular);
          if (!response.ok) throw new Error("Error al buscar");
          const data = await response.json();
          setMovie(data.results);
          setTotalPages(data.total_pages)
        }
      } catch (error) {
        console.error("Error al cargar la api", error);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, page]);

  useEffect(() => {
    setPage(1);
  }, [search])

  const scrollIzquierda = () => {
    if (carruselRef.current) {
      carruselRef.current.scrollBy({ left: -600, behavior: "smooth" });
    }
  };

  const scrollDerecha = () => {
    if (carruselRef.current) {
      carruselRef.current.scrollBy({ left: 600, behavior: "smooth" });
    }
  };

  return (
    <>
      <Header search={search} setSearch={setSearch} />

      {movie.length > 0 && (
        <Hero pelicula={movie[0]} onSelect={setSelectedMovie} />
      )}

      <main className="min-h-screen w-full pb-8 bg-slate-900 text-white">
        {/* 👇 Añadimos 'relative' y 'group' aquí para que los botones funcionen */}
        <div className="max-w-7xl mx-auto px-4 mt-8 relative group">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            Recomendaciones para ti
          </h2>

          {/* Botón Izquierdo */}
          <button
            onClick={scrollIzquierda}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 text-white w-10 h-20 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-7xl"
          >
            ‹
          </button>

          <div className="relative">
            {/* Sombras laterales */}
            <div className="absolute top-0 right-0 w-16 h-full bg-linear-to-l from-slate-900 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-16 h-full bg-linear-to-r from-slate-900 to-transparent z-20 pointer-events-none"></div>

            {/* 👇 Aquí está el ref que faltaba y las clases corregidas */}
            <div
              ref={carruselRef}
              className="flex gap-4 overflow-x-auto pb-8 pt-4 px-4 hide-scrollbar scroll-smooth snap-x relative"
            >
              {movie.map((peli) => (
                <div key={peli.id} className="min-w-37.5 md:min-w-50 snap-start">
                  <MovieCard pelicula={peli} onSelect={setSelectedMovie} />
                </div>
              ))}
            </div>
          </div>

          {/* Botón Derecho */}
          <button
            onClick={scrollDerecha}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30  text-white w-10 h-20 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-7xl"
          >
            ›
          </button>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Explorar todo</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movie.map((peli) => (
              <MovieCard key={peli.id} pelicula={peli} onSelect={setSelectedMovie} />
            ))}
          </div>
        </div>

        {/* Paginacion */}
        <div className="flex justify-center items-center gap-4 mt-8 text-white">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="bg-slate-800 px-4 py-2 rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <span>Página {page} de {totalPages}</span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="bg-slate-800 px-4 py-2 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>

        {selectedMovie && (
          <MovieModal
            pelicula={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </main>
    </>
  );
}

export default App;
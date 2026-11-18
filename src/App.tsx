import { useEffect, useState, useRef } from "react";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import { Header } from "./components/Navbar";
import { Hero } from "./components/Hero";
import type { Peli, TMDBResponse } from './types'
import { Routes, Route } from "react-router-dom";
import { MoviePage } from "./pages/MoviePage";


function App() {
  // ==========================================
  // 1. ESTADOS PRINCIPALES
  // ==========================================
  const [search, setSearch] = useState("");           // Texto del buscador
  const [movie, setMovie] = useState<Peli[]>([]);     // Películas de la API
  const [selectedMovie, setSelectedMovie] = useState<Peli | null>(null); // Película para el Modal
  const [page, setPage] = useState(1);                // Página actual de la API
  const [totalPages, setTotalPages] = useState(1);    // Total de páginas de la API
  const [verFavoritos, setVerFavoritos] = useState(false); // Vista actual (Inicio o Mi Lista)
  const [topRated, setTopRated] = useState<Peli[]>([]) // Top Rated o Mejor Valoradas
  // Referencia para controlar el scroll del carrusel
  const carruselRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // 2. ESTADO DE FAVORITOS (Con LocalStorage)
  // ==========================================
  // Inicializamos el estado leyendo del localStorage (si existe)
  const [fav, setFav] = useState<Peli[]>(() => {
    const saves = localStorage.getItem("favoritos");
    if (!saves) return [];

    try {
      return JSON.parse(saves) as Peli[];
    } catch (error) {
      console.error("No se pudieron leer los favoritos guardados", error);
      return [];
    }
  });

  // Efecto que se ejecuta cada vez que cambian los favoritos para guardarlos
  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(fav));
  }, [fav]);

  // ==========================================
  // 3. EFECTO DE CARGA DE DATOS (Buscador y Paginación)
  // ==========================================
  useEffect(() => {
    // Usamos un temporizador (Debounce) para no saturar la API mientras el usuario escribe
    const timer = setTimeout(async () => {
      try {
        if (search.length >= 3) {
          // Búsqueda por texto
          const urlSearch = `https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${search}&language=es-MX&page=${page}`;
          const response = await fetch(urlSearch);
          if (!response.ok) throw new Error("Error al buscar");
          const data = (await response.json()) as TMDBResponse
          const resultadosFiltrados = data.results.filter((item) => item.media_type !== 'person')
          setMovie(resultadosFiltrados);
          setTotalPages(data.total_pages);
        } else if (search.length === 0) {
          // Carga inicial (Populares)
          const urlPopular = `https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=es-MX&page=${page}`;
          const urlTopRated = `https://api.themoviedb.org/3/movie/top_rated?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=es-MX&page=${page}`
          const response = await fetch(urlPopular);
          const responseTopRated = await fetch(urlTopRated)
          if (!response.ok) throw new Error("Error al buscar");
          if (!responseTopRated.ok) throw new Error("Error al buscar");
          const data = await response.json();
          const dataTopRated = await responseTopRated.json();
          setMovie(data.results);
          setTotalPages(data.total_pages);
          setTopRated(dataTopRated.results)
        }
      } catch (error) {
        console.error("Error al cargar la api", error);
      }
    }, 500);

    // Limpiamos el temporizador si el usuario sigue escribiendo
    return () => clearTimeout(timer);
  }, [search, page]);

  // ==========================================
  // 4. FUNCIONES (Buscador, Scroll, Favoritos)
  // ==========================================
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1); // Si busca algo nuevo, siempre volvemos a la página 1
  };

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

  const toggleFav = (peli: Peli) => {
    setFav((actuales) =>
      actuales.some((favorita) => favorita.id === peli.id)
        ? actuales.filter((favorita) => favorita.id !== peli.id) // Si ya está, lo quitamos
        : [...actuales, peli] // Si no está, lo agregamos
    );
  };

  // ==========================================
  // 5. RENDERIZADO
  // ==========================================
  return (
    <>
      {/* --- HEADER --- */}
      <Header
        search={search}
        setSearch={handleSearchChange}
        verFavoritos={verFavoritos}
        setVerFavoritos={setVerFavoritos}
      />

      {/* Interruptor de rutas */}
      <Routes>

        <Route path="/" element={
          <>
            {/* --- HERO (Solo se muestra en Inicio) --- */}
            {!verFavoritos && movie.length > 0 && (
              <Hero peliculas={movie.slice(0, 5)} onSelect={setSelectedMovie} />
            )}

            <main className="min-h-screen w-full bg-slate-950 pb-12 text-white">
              {/* --- CARRUSEL (Solo se muestra en Inicio) --- */}
              {!verFavoritos && (
                <div className="group relative mx-auto mt-8 max-w-7xl px-4">
                  <h2 className="mb-4 text-xl font-bold text-white md:text-2xl">
                    Recomendaciones para ti
                  </h2>

                  {/* Botón Izquierdo */}
                  <button
                    onClick={scrollIzquierda}
                    type="button"
                    aria-label="Desplazar películas a la izquierda"
                    className="absolute left-0 top-1/2 z-30 flex h-20 w-10 -translate-y-1/2 items-center justify-center rounded-r-lg bg-slate-950/80 text-4xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    ‹
                  </button>

                  <div className="relative">
                    {/* Sombras laterales del carrusel */}
                    <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-12 bg-linear-to-l from-slate-950 to-transparent"></div>
                    <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-12 bg-linear-to-r from-slate-950 to-transparent"></div>

                    <div
                      ref={carruselRef}
                      className="relative flex snap-x gap-4 overflow-x-auto px-4 pb-8 pt-4 hide-scrollbar scroll-smooth"
                    >
                      {topRated.map((peli) => (
                        // Ancho fijo (150px en móvil, 200px en PC) y shrink-0 para que no se aplasten
                        <div key={peli.id} className="w-36 shrink-0 snap-start md:w-48">
                          <MovieCard
                            pelicula={peli}
                            onSelect={setSelectedMovie}
                            esFavorito={fav.some((f) => f.id === peli.id)}
                            onToggleFav={() => toggleFav(peli)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botón Derecho */}
                  <button
                    onClick={scrollDerecha}
                    type="button"
                    aria-label="Desplazar películas a la derecha"
                    className="absolute right-0 top-1/2 z-30 flex h-20 w-10 -translate-y-1/2 items-center justify-center rounded-l-lg bg-slate-950/80 text-4xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    ›
                  </button>
                </div>
              )}

              {/* --- GRID PRINCIPAL --- */}
              <div className="mx-auto mt-12 max-w-7xl px-4">
                <h2 className="mb-6 text-xl font-bold text-white md:text-2xl">
                  {verFavoritos ? "Mi lista" : "Explorar todo"}
                </h2>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 xl:grid-cols-5">
                  {/* Si estamos en favoritos, mapeamos 'fav', si no, mapeamos 'movie' */}
                  {verFavoritos
                    ? fav.map((peli) => (
                      <MovieCard
                        key={peli.id}
                        pelicula={peli}
                        onSelect={setSelectedMovie}
                        esFavorito={true}
                        onToggleFav={() => toggleFav(peli)}
                      />
                    ))
                    : movie.map((peli) => (
                      <MovieCard
                        key={peli.id}
                        pelicula={peli}
                        onSelect={setSelectedMovie}
                        esFavorito={fav.some((f) => f.id === peli.id)}
                        onToggleFav={() => toggleFav(peli)}
                      />
                    ))}

                  {/* Mensaje si la lista de favoritos está vacía */}
                  {verFavoritos && fav.length === 0 && (
                    <p className="col-span-full rounded-lg border border-blue-900/40 bg-slate-900 p-10 text-center text-lg text-slate-400">
                      No tienes películas en tu lista todavía. ¡Empieza a darle al corazón! ❤️
                    </p>
                  )}
                </div>
              </div>

              {/* --- PAGINACIÓN (Oculta en Favoritos) --- */}
              {!verFavoritos && (
                <div className="mt-10 flex items-center justify-center gap-4 text-white">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="cursor-pointer rounded-md border border-blue-800 bg-slate-900 px-4 py-2 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Anterior
                  </button>

                  <span>Página {page} de {totalPages}</span>

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="cursor-pointer rounded-md border border-blue-800 bg-slate-900 px-4 py-2 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              )}

              {/* --- MODAL DE DETALLES --- */}
              {selectedMovie && (
                <MovieModal
                  pelicula={selectedMovie}
                  onClose={() => setSelectedMovie(null)}
                />
              )}
            </main>
          </>
        }
        />
        {/* Ruta 2 */}
        <Route path="/:mediaType/:id" element={<MoviePage />} />
      </Routes>
    </>
  );
}

export default App;
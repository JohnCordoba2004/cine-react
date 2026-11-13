import { useEffect, useState, useRef } from "react";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import type { Peli } from "./types";
import { Header } from "./components/Navbar";
import { Hero } from "./components/Hero";

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
          const urlSearch = `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${search}&language=es-MX&page=${page}`;
          const response = await fetch(urlSearch);
          if (!response.ok) throw new Error("Error al buscar");
          const data = await response.json();
          setMovie(data.results);
          setTotalPages(data.total_pages);
        } else if (search.length === 0) {
          // Carga inicial (Populares)
          const urlPopular = `https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=es-MX&page=${page}`;
          const response = await fetch(urlPopular);
          if (!response.ok) throw new Error("Error al buscar");
          const data = await response.json();
          setMovie(data.results);
          setTotalPages(data.total_pages);
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

      {/* --- HERO (Solo se muestra en Inicio) --- */}
      {!verFavoritos && movie.length > 0 && (
        <Hero peliculas={movie.slice(0, 5)} onSelect={setSelectedMovie} />
      )}

      <main className="min-h-screen w-full pb-8 bg-slate-900 text-white">

        {/* --- CARRUSEL (Solo se muestra en Inicio) --- */}
        {!verFavoritos && (
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
              {/* Sombras laterales del carrusel */}
              <div className="absolute top-0 right-0 w-16 h-full bg-linear-to-l from-slate-900 to-transparent z-20 pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-16 h-full bg-linear-to-r from-slate-900 to-transparent z-20 pointer-events-none"></div>

              <div
                ref={carruselRef}
                className="flex gap-4 overflow-x-auto pb-8 pt-4 px-4 hide-scrollbar scroll-smooth snap-x relative"
              >
                {movie.map((peli) => (
                  // Ancho fijo (150px en móvil, 200px en PC) y shrink-0 para que no se aplasten
                  <div key={peli.id} className="w-[150px] md:w-[200px] shrink-0 snap-start">
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
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 text-white w-10 h-20 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-7xl"
            >
              ›
            </button>
          </div>
        )}

        {/* --- GRID PRINCIPAL --- */}
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
            {verFavoritos ? "Mi lista" : "Explorar todo"}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
              <p className="col-span-full text-center text-gray-400 py-10 text-lg">
                No tienes películas en tu lista todavía. ¡Empieza a darle al corazón! ❤️
              </p>
            )}
          </div>
        </div>

        {/* --- PAGINACIÓN (Oculta en Favoritos) --- */}
        {!verFavoritos && (
          <div className="flex justify-center items-center gap-4 mt-8 text-white">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="bg-slate-800 px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
            >
              Anterior
            </button>

            <span>Página {page} de {totalPages}</span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="bg-slate-800 px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
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
  );
}

export default App;
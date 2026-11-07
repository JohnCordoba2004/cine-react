import type { Peli, PeliDetalle } from "../types";
import { useState, useEffect } from "react";

interface Props {
  pelicula: Peli;
  onClose: () => void;
}

function MovieModal({ pelicula, onClose }: Props) {
  const urlImg = pelicula.poster_path
    ? `https://image.tmdb.org/t/p/w500`
    : "https://dummyimage.com/600x400/000/5d67f0";

  /* Estado Detalles */
  const [details, setDetails] = useState<PeliDetalle | null>(null);
  /* Estado Carga */
  const [loading, setLoading] = useState(true);
  /* Estado Error */
  const [error, setError] = useState<string | null>(null);
  /* Estado trailer */
  const [showTrailer, setShowTrailer] = useState(false);

  // Primero busca un Trailer, luego un Teaser, luego cualquier video de YouTube
  const trailerVideo =
    details?.videos.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer",
    ) ||
    details?.videos.results.find(
      (v) => v.site === "YouTube" && v.type === "Teaser",
    ) ||
    details?.videos.results.find((v) => v.site === "YouTube");

  const trailerKey = trailerVideo?.key || details?.videos.results[0]?.key;

  useEffect(() => {
    //Definimos la funcion asincrona
    const fetchMovieDetails = async () => {
      const urlEsp = `https://api.themoviedb.org/3/movie/${pelicula.id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=es-MX&append_to_response=videos`;
      const urlEng = `https://api.themoviedb.org/3/movie/${pelicula.id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&append_to_response=videos`;

      try {
        const response = await fetch(urlEsp);
        if (!response.ok) throw new Error("Error al cargar los detalles");

        let data: PeliDetalle = await response.json();

        if (data.videos.results.length === 0) {
          const responseEng = await fetch(urlEng);
          if (responseEng.ok) {
            data = await responseEng.json();
          }
        }
        setDetails(data);
        console.log("Datos finales:", data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [pelicula.id]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 ">
      <div className="bg-[#0a0a0a] rounded-2xl w-full max-w-4xl flex overflow-hidden relative">
        {/* Imagen */}
        <img
          src={urlImg + pelicula.poster_path}
          alt={pelicula.original_title}
          loading="lazy"
          className="w-[40%] object-cover hidden md:block"
        />
        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center font-bold"
        >
          X
        </button>

        <div className="w-full md:w-[60%] p-8 flex flex-col justify-center gap-4">
          {/* Contenido */}
          <h2 className="text-3xl font-bold text-white uppercase mb-4">
            {pelicula.title}
          </h2>

          <div className="flex gap-4 text-sm text-gray-400">
            <span>{pelicula.release_date.split("-")[0]}</span>
            {/* Duration */}
            <span>
              {loading
                ? "Cargando..."
                : details?.runtime
                  ? `${details.runtime} min`
                  : "N/A"}
            </span>
            {/* Genres */}
            <span>
              {loading
                ? "Cargando..."
                : details?.genres.map((g) => g.name).join(" ") || "Sin género"}
            </span>
          </div>

          {/* Overview */}
          <p className="text-slate-300">{pelicula.overview}</p>

          {/* Vote */}
          <div className="text-yellow-400">
            {pelicula.vote_average.toFixed(1)}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {trailerKey && !showTrailer && (
            <button
              onClick={() => setShowTrailer(true)}
              type="button"
              className="border border-yellow-500 text-yellow-500 px-6 py-2 rounded-md w-max hover:bg-yellow-50 hover:text-black transition-colors"
            >
              Watch Trailer
            </button>
          )}

          {showTrailer && trailerKey && (
            <div
              className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4"
              onClick={() => setShowTrailer(false)}
            >
              {/* Btn para cerrar */}
              <button
                className="absolute top-6 right-6 text-white bg-red-600 hover:bg-red-500 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold transition-colors z-10 shadow-lg"
                onClick={() => setShowTrailer(false)}
              >
                X
              </button>
              {/* Video */}
              <div
                className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                  title="Trailer"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieModal;

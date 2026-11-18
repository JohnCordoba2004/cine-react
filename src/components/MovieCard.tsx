import { Heart } from "lucide-react";
import type { Peli } from "../types";

interface Props {
  pelicula: Peli;
  onSelect: (peli: Peli) => void;
  esFavorito: boolean
  onToggleFav: () => void
}

function MovieCard({ pelicula, onSelect, esFavorito, onToggleFav }: Props) {
  const urlImg = pelicula.poster_path
    ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`
    : "https://dummyimage.com/600x900/101b35/ffffff&text=Sin+poster";
  return (
    <div
      onClick={() => onSelect(pelicula)}
      className="relative cursor-pointer overflow-hidden rounded-lg border border-blue-900/40 bg-slate-900 shadow-lg transition-transform duration-300 hover:z-10 hover:scale-105"
    >
      <div className="relative">
        <img
          src={urlImg}
          alt={pelicula.title || pelicula.name || 'Sin título'}
          className="aspect-2/3 w-full object-cover"
        />
        <button
          type="button"
          aria-label={esFavorito ? "Quitar de Mi lista" : "Agregar a Mi lista"}
          onClick={(e) => { e.stopPropagation(); onToggleFav() }}
          className="absolute right-2 top-2 z-20 rounded-full bg-slate-950/80 p-2 transition-colors hover:bg-blue-600"
        >
          <Heart
            size={20}
            className={esFavorito ? "fill-red-500 text-red-500" : "text-white"}
          />
        </button>
      </div>
      <div className="p-3">
        <h2 className="truncate text-base font-bold text-white">
          {pelicula.title || pelicula.name}
        </h2>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-slate-400">
            {(pelicula.release_date || pelicula.first_air_date)?.split("-")[0] || "Año desconocido"}
          </span>
          <span className="text-sm font-semibold text-blue-300">
            {pelicula.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;

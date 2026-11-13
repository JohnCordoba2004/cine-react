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
    ? `https://image.tmdb.org/t/p/w500`
    : "https://dummyimage.com/600x400/000/5d67f0";
  return (
    <div
      onClick={() => onSelect(pelicula)}
      className="cursor-pointer bg-slate-800 rounded-xl overflow-hidden shadow-lg group hover:scale-105 hover:z-10 hover:outline-2 hover:outline-white transition-transform duration-300 ease-in-out relative"
    >
      {/* Container img y btn */}
      <div className="relative">
        {/* Image */}
        <img
          src={urlImg + pelicula.poster_path}
          alt={pelicula.original_title}
          className="w-full object-cover aspect-2/3"
        />
        {/* Btn fav */}
        <button onClick={(e) => { e.stopPropagation(); onToggleFav() }} className="absolute top-2 right-2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 transition-colors backdrop-blur-sm">
          <Heart
            size={20}
            className={esFavorito ? "fill-red-500 text-red-500" : "text-white"}
          />
        </button>
      </div>
      {/* Container */}
      <div className="p-4">
        {/* Title */}
        <h2 className="text-lg font-bold text-white line-clamp-1">
          {pelicula.title}
        </h2>
        <div className="flex justify-between items-center mt-2">
          {/* Anio */}
          <span className="text-sm text-slate-400">
            {pelicula.release_date.split("-")[0] ?? null}
          </span>
          {/* Voto */}
          <span className="text-sm text-yellow-400">
            {pelicula.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;

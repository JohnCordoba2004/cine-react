import type { Peli } from "../types";

interface Props {
  pelicula: Peli;
  onSelect: (peli: Peli) => void;
}

function MovieCard({ pelicula, onSelect }: Props) {
  const urlImg = pelicula.poster_path
    ? `https://image.tmdb.org/t/p/w500`
    : "https://dummyimage.com/600x400/000/5d67f0";
  return (
    <div
      onClick={() => onSelect(pelicula)}
      className="cursor-pointer bg-slate-800 rounded-xl overflow-hidden shadow-lg group"
    >
      {/* Image */}
      <img
        src={urlImg + pelicula.poster_path}
        alt={pelicula.original_title}
        className="w-full object-cover transition-transform duration-300 group-hover:scale-102 aspect-2/3"
      />
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

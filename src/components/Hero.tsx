import type { Peli } from "../types";

interface Props {
    pelicula: Peli;
    onSelect: ((peli: Peli) => void)
}

export function Hero({ pelicula, onSelect }: Props) {
    /* Usamos la img original max calidad */
    const urlImg = pelicula.poster_path
        ? `https://image.tmdb.org/t/p/original/${pelicula.backdrop_path}`
        : "https://dummyimage.com/600x400/000/5d67f0";
    return (
        /* Contenedor exterior: centra contenido y da margen superior */
        <div className="max-w-7xl mx-auto px-4 mt-6 mb-8">
            {/* Card: Redondeada, oculta lo que se sale y tiene sombra */}
            <div className="relative w-full h-[60vh] md:h-[70vh] rounded-4xl overflow-hidden shadow-2xl">

                {/* Img de fondo */}
                <img
                    src={urlImg + pelicula.backdrop_path}
                    alt={pelicula.original_title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Gradiente */}
                <div className="absolute top-12 left-8 md:top-20 md:left-16 max-w-xl z-10 flex flex-col gap-4">
                    {/* Metadatos (simulados) */}
                    <div className="flex items-center gap-2 text-sm text-gray-300 font-semibold">
                        <span>12+</span>
                        <span>•</span>
                        <span>{pelicula.release_date.split('-')[0]}</span>
                        <span>•</span>
                        <span>Película</span>
                    </div>
                    {/* Titulo */}
                    <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg leading-tight">{pelicula.title}</h2>
                    {/* Sinopsis */}
                    <p className="line-clamp-3 text-gray-300 text-sm md:text-base font-medium drop-shadow-md">{pelicula.overview}</p>
                    {/* Botones*/}
                    <div className="flex gap-4 mt-4">
                        <button type="button" className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition-colors">▶ Reproducir</button>

                        <button type="button" onClick={() => onSelect(pelicula)} className="bg-black/40 backdrop-blur-md border border-white/20 text-white px-6 py2.5 rounded-lg font-bold hover:bg-black/60 transition-colors">
                            + Más información
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
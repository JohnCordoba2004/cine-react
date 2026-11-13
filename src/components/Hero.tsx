import { useEffect, useState } from "react";
import type { Peli } from "../types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    peliculas: Peli[];
    onSelect: (peli: Peli) => void;
}

export function Hero({ peliculas, onSelect }: Props) {
    const listaIds = peliculas.map((peli) => peli.id).join(",");
    const [slide, setSlide] = useState({ listaIds: "", index: 0 });

    // Si llega otra página o búsqueda, empieza mostrando la primera película.
    const currentIndex =
        slide.listaIds === listaIds && peliculas.length > 0
            ? slide.index % peliculas.length
            : 0;

    const peliculaActual = peliculas[currentIndex];

    useEffect(() => {
        if (peliculas.length <= 1) return;
        const intervalId = window.setInterval(() => {
            setSlide((actual) => {
                const indexActual =
                    actual.listaIds === listaIds ? actual.index : 0;

                return {
                    listaIds,
                    index: (indexActual + 1) % peliculas.length,
                };
            });
        }, 5000);

        return () => window.clearInterval(intervalId);
    }, [listaIds, peliculas.length]);


    if (!peliculaActual) return null;

    const cambiarSlide = (direccion: 'next' | 'prev') => {
        setSlide((actual) => {
            const indiceActual = actual.listaIds === listaIds ? actual.index : 0
            const nuevoIndex = direccion === 'next'
                ? (indiceActual + 1) % peliculas.length
                : (indiceActual - 1 + peliculas.length) % peliculas.length
            return { listaIds, index: nuevoIndex }
        })
    }

    return (
        <div className="mx-auto mb-8 mt-6 max-w-7xl px-4">
            <div className="group relative h-[60vh] w-full overflow-hidden rounded-4xl shadow-2xl md:h-[70vh]">
                {peliculas.map((peli, index) => (
                    <img
                        key={peli.id}
                        src={
                            peli.backdrop_path
                                ? `https://image.tmdb.org/t/p/original${peli.backdrop_path}`
                                : "https://dummyimage.com/600x400/000/5d67f0"
                        }
                        alt={peli.original_title}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "z-0 opacity-100" : "opacity-0"
                            }`}
                    />
                ))}

                {/* Degradado */}
                <div className="absolute inset-0 z-10 bg-linear-to-r from-slate-900/95 via-slate-900/40 to-transparent" />

                {/* Btn izq */}
                <button onClick={() => cambiarSlide('prev')} className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 transition-all hover:bg-black/70 group-hover:opacity-100">
                    <span className="text-4xl"><ChevronLeft size={20} strokeWidth={1} /></span>
                </button>

                {/* Btn der */}
                <button onClick={() => cambiarSlide('next')} className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 transition-all hover:bg-black/70 group-hover:opacity-100">
                    <span className="text-4xl"><ChevronRight size={20} strokeWidth={1} /></span>
                </button>

                <div className="absolute left-8 top-12 z-20 flex max-w-xl flex-col gap-4 md:left-16 md:top-20">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                        <span>12+</span>
                        <span>•</span>
                        <span>{peliculaActual.release_date?.split("-")[0] ?? ""}</span>
                        <span>•</span>
                        <span>Película</span>
                    </div>

                    <h2 className="text-4xl font-bold leading-tight text-white drop-shadow-lg md:text-6xl">
                        {peliculaActual.title}
                    </h2>

                    <p className="line-clamp-3 text-sm font-medium text-gray-300 drop-shadow-md md:text-base">
                        {peliculaActual.overview}
                    </p>

                    <div className="mt-4 flex gap-4">
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 font-bold text-black transition-colors hover:bg-gray-200"
                        >
                            ▶ Reproducir
                        </button>

                        <button
                            type="button"
                            onClick={() => onSelect(peliculaActual)}
                            className="rounded-lg border border-white/20 bg-black/40 px-6 py-2.5 font-bold text-white backdrop-blur-md transition-colors hover:bg-black/60"
                        >
                            + Más información
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
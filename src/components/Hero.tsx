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
        <section className="relative mb-10 h-130 w-full overflow-hidden bg-slate-900 md:h-155">
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

            {/* Estas capas oscuras mantienen el texto legible sobre cualquier imagen. */}
            <div className="absolute inset-0 z-10 bg-linear-to-r from-slate-950 via-slate-950/70 to-transparent" />
            <div className="absolute inset-0 z-10 bg-linear-to-t from-slate-950 via-transparent to-slate-950/30" />

            <button
                type="button"
                aria-label="Película anterior"
                onClick={() => cambiarSlide('prev')}
                className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-slate-950/70 p-3 text-white transition-colors hover:bg-blue-600"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                type="button"
                aria-label="Siguiente película"
                onClick={() => cambiarSlide('next')}
                className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-slate-950/70 p-3 text-white transition-colors hover:bg-blue-600"
            >
                <ChevronRight size={24} />
            </button>

            <div className="absolute inset-x-0 bottom-0 z-20">
                <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-12 pb-12 md:px-20 md:pb-16">
                    <p className="font-semibold uppercase tracking-widest text-blue-300">
                        Cine React recomienda
                    </p>

                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                        <span>{peliculaActual.release_date?.split("-")[0] ?? "Película"}</span>
                        <span>•</span>
                        <span>★ {peliculaActual.vote_average.toFixed(1)}</span>
                    </div>

                    <h2 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-6xl">
                        {peliculaActual.title}
                    </h2>

                    <p className="line-clamp-3 max-w-xl text-sm leading-6 text-slate-200 md:text-base">
                        {peliculaActual.overview}
                    </p>

                    <button
                        type="button"
                        onClick={() => onSelect(peliculaActual)}
                        className="mt-2 rounded-md bg-blue-500 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-400"
                    >
                        Ver detalles
                    </button>

                    <div className="mt-2 flex gap-2" aria-label="Elegir película destacada">
                        {peliculas.map((peli, index) => (
                            <button
                                key={peli.id}
                                type="button"
                                aria-label={`Mostrar ${peli.title}`}
                                onClick={() => setSlide({ listaIds, index })}
                                className={`h-1 rounded-full transition-all ${index === currentIndex ? "w-10 bg-blue-400" : "w-5 bg-white/50 hover:bg-white"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
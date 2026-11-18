import { ArrowLeft, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { PeliDetalle } from '../types'

export function MoviePage() {
    //userParams nos permite leer el :id que viene en la URL
    const { mediaType, id } = useParams()
    const [details, setDetails] = useState<PeliDetalle | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Pedimos los detalles + credits (reparto) + videos (tráiler)
                const url = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=es-MX&append_to_response=credits,videos`;
                const response = await fetch(url)
                if (!response.ok) throw new Error("Error cargando detalles");
                const data = await response.json()
                setDetails(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchDetails()
    }, [id, mediaType])

    if (loading) return <div className="text-white text-center mt-20">Cargando...</div>
    if (!details) return <div className="text-white text-center mt-20">No se encontró la película</div>

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-12">
            {/* Fondo */}
            <div className="relative w-full h-[50vh] md:h-[60vh]">
                <img src={
                    details.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
                        : 'https://dummyimage.com/600x400/000/5d67f0'}
                    alt={details.title}
                    className='absolute inset-0 w-full h-full object-cover'
                />
                {/* Gradiente */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <Link to='/' className='absolute top-6 left-6 z-50 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-black transition-colors inline-flex items-center gap-2 text-white '>
                    <ArrowLeft size={20} /> Volver al inicio
                </Link>
            </div>

            {/* Container */}
            <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Póster */}
                    <div className="w-48 md:w-72 shrink-0 mx-auto md:mx-0">
                        <img src={details.poster_path
                            ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                            : 'https://dummyimage.com/600x900/101b35/ffffff&text=Sin+Poster'}
                            alt={details.title}
                            className='w-full rounded-xl shadow-2xl border border-slate-800' />
                    </div>
                    {/* Información */}
                    <div className="flex-1 text-center md:text-left mt-4 md:mt-16">
                        <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>
                            {details.title || details.name}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-300 text-sm md:text-base font-medium mb-6">
                            <span className='flex items-center gap-1 text-yellow-400'>
                                <Star size={18} fill='currentColor' />{details.vote_average.toFixed(1)}
                            </span>
                            <span>{(details.release_date || details.first_air_date)?.split('-')[0]}</span>
                            {details.runtime && <span>{details.runtime}min</span>}
                        </div>
                        {/* Generos */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                            {details.genres.map((genre) => (
                                <span key={genre.id} className='bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm'>
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                        <h3 className='text-xl font-bold mb-2'>Sinopsis</h3>
                        <p className='text-slate-300 leading-relaxed max-w-3xl'>
                            {details.overview}
                        </p>
                    </div>
                </div>

                {/* Reparto */}
                <div className="mt-16">
                    <h2 className='text-2xl font-bold mb-6 text-white border-b border-slate-800 pb-2'>
                        Reparto Principal
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {details.credits.cast.slice(0, 12).map((actor) => (
                            <div key={actor.id} className="bg-slate-900 rounded-xl p-4 flex flex-col items-center text-center border border-slate-800">
                                <img src={actor.profile_path
                                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                    : 'https://dummyimage.com/150x150/101b35/ffffff&text=Sin+Foto'} alt={actor.name}
                                    className='w-20 h-20 rounded-full object-cover mb-3 border-2 border-slate-700'
                                />
                                <p className='text-sm font-bold text-white line-clamp-1'>
                                    {actor.name}
                                </p>
                                <p className='text-xs text-slate-400 mt-1 line-clamp-1'>
                                    {actor.character}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

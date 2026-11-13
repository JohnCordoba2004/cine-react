import SearchBar from "./SearchBar"
interface Props {
    search: string;
    setSearch: (val: string) => void;
    verFavoritos: boolean
    setVerFavoritos: (val: boolean) => void
}


export function Header({ search, setSearch, verFavoritos, setVerFavoritos }: Props) {
    return (
        <header className="w-full py-1 bg-[#0a0a0a] border-b border-gray-800/50">

            <div className="max-w-7xl mx-auto flex items-center justify-between px-2 py-0.5">
                {/* Lado Izquierdo: Logo y Links */}
                <div className="flex items-center justify-center gap-8">
                    {/* Logo */}
                    <h1 className="text-3xl font-black text-red-600 tracking-tighter cursor-pointer">
                        <span className="text-white">Cine React</span>
                    </h1>

                    {/* Links (Ocultos en navegación) */}
                    <nav className="hidden md:flex items-center justify-center gap-6">
                        <button onClick={() => setVerFavoritos(false)} className={`font-medium transition-colors ${!verFavoritos ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                            Inicio
                        </button>

                        <button className="text-gray-400 hover:text-white font-medium transition-colors">Película</button>
                        <button className="text-gray-400 hover:text-white font-medium transition-colors">Series</button>

                        {/* Mi lista */}

                        <button onClick={() => setVerFavoritos(true)} className={`font-medium transition-colors ${verFavoritos ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                            Mi lista
                        </button>
                    </nav>

                </div>
                {/* Lado Derecho: Buscador */}
                <div className="w-full max-w-xs md:max-w-sm">
                    <SearchBar search={search} setSearch={setSearch}></SearchBar>
                </div>

            </div>

        </header>
    )
}

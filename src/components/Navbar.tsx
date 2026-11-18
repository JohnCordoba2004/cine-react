import SearchBar from "./SearchBar"
interface Props {
    search: string;
    setSearch: (val: string) => void;
    verFavoritos: boolean
    setVerFavoritos: (val: boolean) => void
}


export function Header({ search, setSearch, verFavoritos, setVerFavoritos }: Props) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-blue-900/40 bg-slate-950/95 py-2 backdrop-blur">

            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
                {/* Lado Izquierdo: Logo y Links */}
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <h1 className="cursor-pointer text-2xl font-black tracking-wide text-white md:text-3xl">
                        Cine <span className="text-blue-400">React</span>
                    </h1>

                    {/* Links (Ocultos en navegación) */}
                    <nav className="hidden items-center gap-6 md:flex">
                        <button type="button" onClick={() => setVerFavoritos(false)} className={`border-b-2 py-2 font-medium transition-colors ${!verFavoritos ? 'border-blue-400 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}>
                            Inicio
                        </button>

                        <button type="button" className="font-medium text-slate-400 transition-colors hover:text-white">Películas</button>
                        <button type="button" className="font-medium text-slate-400 transition-colors hover:text-white">Series</button>

                        {/* Mi lista */}

                        <button type="button" onClick={() => setVerFavoritos(true)} className={`border-b-2 py-2 font-medium transition-colors ${verFavoritos ? 'border-blue-400 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}>
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

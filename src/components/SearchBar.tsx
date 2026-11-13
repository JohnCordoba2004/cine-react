import { Search } from "lucide-react";
import { useState } from "react";


function SearchBar({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="flex items-center justify-end">
      <div className={`flex items-center bg-slate-800 rounded-full overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'w-64 px-4 py-2' : 'w-10 h-10 justify-center cursor-pointer hover:bg-slate-700'}`}>
        <button onClick={() => setIsOpen(!isOpen)} className="flex h-10 w-10 shrink-0 items-center justify-center text-gray-400 hover:text-white">
          {/* svg */}
          <Search size={20} strokeWidth={1} />
        </button>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className={`bg-transparent outline-none text-white transition-all duration-300 
          ${isOpen ? 'opacity-100 w-full' : "opacity-0 w-0"}`}
          onBlur={() => setIsOpen(false)} />
      </div>
    </div>
  )
}

export default SearchBar

function SearchBar({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (val: string) => void;
}) {
  return (
    <input
      className="w-full max-w-md p-3
        mb-6 rounded-lg bg-slate-800 border border-slate-600 focus:outline-none"
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

export default SearchBar;

import { memo } from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const SearchBar = memo(({ searchQuery, onSearchChange, onSearch }: SearchBarProps) => {
  return (
    <div className="mb-6">
      <form onSubmit={onSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search jobs by title, company, or location..."
            className="w-full px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15ae5c] focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-[#15ae5c] text-white rounded-lg hover:bg-[#129751] transition-colors duration-200 flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search
        </button>
      </form>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar; 
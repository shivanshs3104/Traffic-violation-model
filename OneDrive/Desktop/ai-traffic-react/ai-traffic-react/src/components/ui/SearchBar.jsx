/**
 * A reusable Search Bar component.
 */
export default function SearchBar({ placeholder, value, onChange }) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <i className="ri-search-line text-gray-400"></i>
      </div>
      <input
        type="search"
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-primary-light bg-primary-medium p-3 pl-10 
                   text-white placeholder-gray-500 
                   focus:border-accent-violet focus:ring-accent-violet"
        placeholder={placeholder || 'Search...'}
      />
    </div>
  );
}
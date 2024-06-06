import { ChangeEvent } from 'react';
import { ISearchBarProps } from '../../@types/interface';

function SearchBar({ onSearch }: ISearchBarProps) {
  // function to handle search input changes and trigger a search.
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value; // get the search query from the input
    onSearch(query); // call the provided onSearch callback with the query
  };
  return (
    <div className="relative mt-12 mx-8 md:max-w-screen-md md:mx-auto mb-12">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        type="search"
        name="search"
        id="search"
        placeholder="Rechercher..."
        className="w-full rounded-md border-gray-300 py-2.5 pe-10 shadow-sm sm:text-sm"
        onChange={handleSearch}
      />

      <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
        <button type="button" className="text-gray-600 hover:text-gray-700">
          <span className="sr-only">Search</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </span>
    </div>
  );
}

export default SearchBar;

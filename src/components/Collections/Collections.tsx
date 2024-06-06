import { useState, useEffect } from 'react';
import axios from 'axios';
import CollectionCard from '../CollectionCard/CollectionCard';
import { ICards } from '../../@types/interface';
import Spinner from '../Spinner/Spinner';
import SearchBar from '../SearchBar/SearchBar';
import Filter from '../Filter/Filter';
import Pagination from '../Pagination/Pagination';

function Collections() {
  // initialize component states
  const [collectionsData, setCollectionsData] = useState<ICards>({ cards: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [collectionsPerPage] = useState(9);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState<ICards>({ cards: [] });

  // filtering collections based on search query and category selection
  const filteredCollections = collectionsData.cards.filter((card) => {
    const lowerCaseTitle = card.title.toLowerCase();
    const lowerCaseDescription = card.description.toLowerCase();
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      card.published === 1 &&
      (lowerCaseTitle.includes(lowerCaseQuery) ||
        lowerCaseDescription.includes(lowerCaseQuery))
    );
  });

  // further filtering by category if a category is selected
  const filteredByCategory =
    selectedCategory === ''
      ? filteredCollections
      : filteredCollections.filter(
          (collection) =>
            collection.category && collection.category.name === selectedCategory
        );

  // state to hold filtered results
  const [filteredResults, setFilteredResults] = useState<ICards>({ cards: [] });

  // fetch collections data from an API endpoint when the component mounts
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const result = await axios.get(
          'http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/card/all'
        );
        setCollectionsData(result.data);
        setIsLoading(false);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          "Une erreur s'est produite lors de la récupération des collections:",
          error
        );
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // update filtered results based on the selected category
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filteredByCategoryUseEffect =
      selectedCategory === ''
        ? filteredCollections
        : filteredCollections.filter(
            (collection) =>
              collection.category &&
              collection.category.name === selectedCategory
          );
    setFilteredResults({ cards: filteredByCategory });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, collectionsData]);

  // update search results based on the search query
  useEffect(() => {
    const filteredResults2 = filteredResults.cards.filter((card) => {
      const lowerCaseTitle = card.title.toLowerCase();
      const lowerCaseDescription = card.description.toLowerCase();
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        card.published === 1 &&
        (lowerCaseTitle.includes(lowerCaseQuery) ||
          lowerCaseDescription.includes(lowerCaseQuery))
      );
    });

    setSearchResults({ cards: filteredResults2 });
  }, [searchQuery, filteredResults]);

  // calculate the index of the last and first collections on the current page
  const indexOfLastCollection = currentPage * collectionsPerPage;
  const indexOfFirstCollection = indexOfLastCollection - collectionsPerPage;

  // extract categories from the collections data
  const { categories } = collectionsData;
  //  ICategory[] = [
  //   { id: 1, name: 'Voyage & Géographie' },
  //   { id: 2, name: 'Bricolage & Déco' },
  //   { id: 3, name: 'Sciences & Technologie' },
  //   { id: 4, name: 'Sports & Loisirs' },
  //   { id: 5, name: 'Art & Culture' },
  //   { id: 6, name: 'Autres' },
  //   { id: 7, name: 'Nature & Environnement' },
  //   { id: 8, name: 'Gastronomie' },
  // ];

  // extract the current collections to be displayed on the current page
  const currentCollections = searchResults.cards.slice(
    indexOfFirstCollection,
    indexOfLastCollection
  );

  // handle page change event
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // handle category change event
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowFilter(false);
  };

  // render loading spinner if data is still loading
  if (isLoading) {
    return <Spinner />;
  }

  // if there are no collections available
  if (!collectionsData || collectionsData.cards.length === 0) {
    // render an error message
    return <div>Aucune collection disponible pour le moment.</div>;
  }

  return (
    <div className="w-11/12 p-1 my-5 pb-3 drop-shadow-Collection mx-auto">
      <h1 className="text-center text-3xl font-bold my-3">Les Collections</h1>
      <p className="text-center my-2">
        Découvrez l&apos;ensemble des collections publiées
      </p>
      <SearchBar onSearch={setSearchQuery} />

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowFilter(!showFilter)}
          className="block mx-auto bg-gray-300 p-2 rounded-md focus:outline-none"
        >
          <svg
            className="h-6 w-6 text-cyan-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        {showFilter && (
          <div className="block mx-auto bg-grey-300 shadow-md rounded-md p-4 w-64">
            <Filter
              showFilter={showFilter}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              categories={categories!}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {currentCollections.map((card) => (
          <CollectionCard {...card} key={card.id} />
        ))}
      </div>

      <Pagination
        collectionsPerPage={collectionsPerPage}
        totalCollections={filteredByCategory.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Collections;

import { IPaginationProps } from '../../@types/interface';
import './Pagination.scss';

function Pagination({
  collectionsPerPage,
  totalCollections,
  currentPage,
  onPageChange,
}: IPaginationProps) {
  // calculate the total number of pages based on collections per page
  const pageNumbers: number[] = [];
  for (
    let i = 1;
    i <= Math.ceil(totalCollections / collectionsPerPage);
    i += 1
  ) {
    pageNumbers.push(i);
  }

  // function to determine which page numbers to display
  const renderPageNumbers = () => {
    const lastPage = pageNumbers.length;

    const shouldDisplayPage = (pageNumber: number) => {
      return (
        pageNumber === 1 || // always display the first page
        pageNumber === lastPage || // always display the last page
        Math.abs(pageNumber - currentPage) <= 2 || // display two pages before and after the current page
        (pageNumber === 2 && currentPage === 1) || // display the next page if on the first page
        (pageNumber === lastPage - 1 && currentPage === lastPage) // display the previous page if on the last page
      );
    };

    return (
      <>
        {currentPage > 1 && (
          <li>
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              className="pagination-button"
            >
              {'<'}
            </button>
          </li>
        )}

        {pageNumbers.map(
          (number) =>
            shouldDisplayPage(number) && (
              <li key={number}>
                <button
                  type="button"
                  onClick={() => onPageChange(number)}
                  className={`pagination-button ${
                    currentPage === number ? 'active' : ''
                  }`}
                >
                  {number}
                </button>
              </li>
            )
        )}

        {currentPage < lastPage && (
          <li>
            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              className="pagination-button"
            >
              {'>'}
            </button>
          </li>
        )}
      </>
    );
  };

  return (
    // render the pagination component
    <nav className="flex items-center justify-center mt-4">
      <ul className="pagination flex space-x-2">{renderPageNumbers()}</ul>
    </nav>
  );
}

export default Pagination;

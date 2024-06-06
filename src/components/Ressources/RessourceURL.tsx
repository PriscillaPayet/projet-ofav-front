import { Link } from 'react-router-dom';
import { IRessourceURLProps } from '../../@types/interface';

// component for rendering URL-based resources within a collection
function RessourceURL({
  url,
  images,
  title,
  description,
  onDelete,
  hideDeleteButton,
}: IRessourceURLProps) {
  // check if 'title' is not defined or null
  if (title === undefined || title === null) {
    // render a link to the URL with a default display
    return (
      <Link to={url} target="_blank">
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg w-11/12 p-3 mb-3 mx-auto sm:max-w-2xl relative">
          <p className="mr-4">{url}</p>
          {/* render a delete button if 'hideDeleteButton' is not specified */}
          {!hideDeleteButton && (
            <button
              type="button"
              onClick={onDelete}
              className="absolute top-0 right-0 mt-0 mr-0 rounded-full bg-gray-400 text-white w-6 h-6 flex items-center justify-center text-xs font-bold focus:outline-none"
            >
              x
            </button>
          )}
        </div>
      </Link>
    );
  }
  // render the URL resource with title, description, and image
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg w-11/12 p-3 mb-3 mx-auto sm:max-w-2xl relative">
      {/* render a link to the URL with proper attributes */}
      <Link
        to={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:no-underline"
      >
        <div className="flex flex-col md:flex-row">
          {/* display the first image as a thumbnail */}
          <img
            src={images[0]}
            alt=""
            className="max-w-xs object-cover mr-4 mb-2 sm:mb-0 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56"
          />

          <div>
            <h2 className="text-xl font-semibold mb-1">
              {/* Display the title and description */}
              {title}
            </h2>
            <p className="text-sm mr-4">{description}</p>
          </div>
        </div>
      </Link>
      {!hideDeleteButton && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-0 right-0 mt-0 mr-0 rounded-full bg-gray-400 text-white w-6 h-6 flex items-center justify-center text-xs font-bold focus:outline-none"
        >
          x
        </button>
      )}
    </div>
  );
}

export default RessourceURL;

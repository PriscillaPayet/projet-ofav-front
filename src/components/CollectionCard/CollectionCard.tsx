import { Link } from 'react-router-dom';
import { IMyCollection } from '../../@types/interface';

function CollectionCard({
  title,
  description,
  picture,
  ressource,
  published,
  id,
  countOfLikes,
  myCollection,
}: IMyCollection) {
  // calculate the number of resources in the collection
  const ressourceCount = ressource.length;

  // if it's the user's own collection, render this UI
  if (myCollection) {
    return (
      <div className="flex flex-col justify-center">
        <Link to={`/collection/${id}`} style={{ textDecoration: 'none' }}>
          <div className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-gray-100 bg-white">
            <div className="w-full md:w-2/3 bg-white grid place-items-center">
              <img
                src={picture}
                alt="couverture de la collection"
                className="rounded-xl"
              />
            </div>
            <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
              <div className="flex justify-end item-center">
                <div className="flex items-center ">
                  <p className="mr-2 text-lg">{countOfLikes}</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-red-500 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-black text-gray-800 text-xl">{title}</h3>
              <p className="md:text-sm text-gray-800 text-base inline">
                {description}
              </p>
              <div className="font-normal text-gray-800 flex items-center">
                <p className="mr-2 font-normal text-gray-800 text-base">
                  {ressourceCount}
                </p>
                <span className="font-normal text-gray-800 text-base">
                  items
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
  // If the collection is published, render this UI
  if (published) {
    return (
      <div className="flex flex-col justify-center">
        <Link to={`/collection/${id}`} style={{ textDecoration: 'none' }}>
          <div className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-gray-100 bg-white">
            <div className="w-full md:w-2/3 bg-white grid place-items-center">
              <img
                src={picture}
                alt="couverture de la collection"
                className="rounded-xl"
              />
            </div>
            <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
              <div className="flex justify-end item-center">
                <div className="flex items-center ">
                  <p className="mr-2 text-lg">{countOfLikes}</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-red-500 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-black text-gray-800 text-xl">{title}</h3>
              <p className="md:text-sm text-gray-800 text-base inline">
                {description}
              </p>
              <div className="font-normal text-gray-800 flex items-center">
                <p className="mr-2 font-normal text-gray-800 text-base">
                  {ressourceCount}
                </p>
                <span className="font-normal text-gray-800 text-base">
                  items
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
  // if the collection is not published and not the user's own collection, return null (doesn't render anything)
  return null;
}

export default CollectionCard;

/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import UserCard from '../UserCard/UserCard';
import { ICollection, ILog } from '../../@types/interface';
import Spinner from '../Spinner/Spinner';
import RessourceURL from '../Ressources/RessourceURL';
import RessourceText from '../Ressources/RessourceText';

function SingleCollection({ isLogged }: ILog) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // Get the user ID from session storage.
  const userId = sessionStorage.getItem('id');
  const navigate = useNavigate();
  const { id } = useParams();
  const [singleCollectionData, setSingleCollectionData] =
    useState<ICollection>();
  const [isLoading, setIsLoading] = useState(true);
  const [deletePopup, setDeletePopup] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean>(
    singleCollectionData?.isLike || false
  );
  const [countOfLikes, setCountOfLikes] = useState<number | undefined>(
    undefined
  );

  // check if the user is logged in and if the user ID is valid
  const isLoggedUser = !!userId;

  // check if the logged-in user is the creator of the collection
  const isCreator =
    isLoggedUser && singleCollectionData?.user.id === Number(userId);

  // function to toggle the popup visibility
  const toggleDeleteConfirmation = () => {
    setDeletePopup(!deletePopup);
  };

  useEffect(() => {
    setIsLiked(!!singleCollectionData?.isLike);
    setCountOfLikes(singleCollectionData?.countOfLikes);
  }, [singleCollectionData]);

  const authToken = sessionStorage.getItem('authToken');

  // function to fetch data for a single collection
  const fetchSingleCollection = useCallback(async () => {
    try {
      // determine the HTTP request headers based on the presence of 'authToken'
      const config = authToken
        ? {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        : {
            headers: {
              Authorization: `non connecté`, // if 'authToken' is not present, we set a default value
              'Content-Type': 'application/json',
            },
          };
      // GET request to retrieve collection data using the determined 'config'
      const result = await axios.get(
        `http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/card/${id}`,
        config
      );
      // update the state with the data we received from collections
      setSingleCollectionData(result.data);

      // set the loading state to 'false' since the data has been successfully fetched
      setIsLoading(false);
    } catch (error) {
      // display an error message in the console if no data is received
      // eslint-disable-next-line no-console
      console.error(
        "Une erreur s'est produite lors de la récupération de la collection:",
        error
      );
    }
  }, [id, authToken]);

  // use the 'fetchSingleCollection' function when the component mounts or 'fetchSingleCollection' changes
  useEffect(() => {
    fetchSingleCollection();
  }, [fetchSingleCollection]);

  const userID = sessionStorage.getItem('id');

  // get the ID of the single collection from the fetched data, if available.
  const cardID = singleCollectionData?.id;

  // function to handle liking the collection
  const handleLike = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      };
      // POST request to the like endpoint
      const response = await axios.post(
        `http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/card/${id}/liked`,
        {
          user: userID,
          card: cardID,
        },

        config
      );
      if (response.status === 200) {
        // set the isLiked state to true if the like is successful
        setIsLiked(true);
        setCountOfLikes((prevCount) => (prevCount ? prevCount + 1 : 1));
        window.location.reload();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error liking the collection:', error);
    }
  };

  useEffect(() => {
    // update the isLiked state based on the provided data
    setIsLiked(!!singleCollectionData?.isLike);
  }, [singleCollectionData]);

  if (isLoading) {
    return <Spinner />;
  }

  // function to navigate to the collection editing page
  const navigateToEdit = () => {
    navigate(`/modification-collection/${id}`);
  };

  // function to handle collection deletion
  const handleDeleteCollection = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      };
      // DELETE request to remove the collection from the server
      await axios.delete(
        `http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/card/${id}/delete`,
        config
      );

      // Redirect the user to mes-collections page after successful deletion
      navigate('/mes-collections');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        "Une erreur s'est produite lors de la suppression de la collection:",
        error
      );
    }
  };

  return (
    <div className="w-11/12 p-1 my-5 pb-3 shadow-2xl mx-auto flex flex-col md:grid md:grid-cols-3 md:gap-4">
      <div className="w-full md:w-2/3 mx-auto md:col-span-1">
        <section className="flex justify-center mb-5">
          <UserCard {...singleCollectionData!.user} />

          <div className="flex justify-end item-center mt-16 ml-10">
            <div className="flex items-center">
              <p className="mr-1">{countOfLikes}</p>
              {/* display the like icon, change color based on whether it's liked */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${
                  isLiked ? 'fill-red-500 ' : 'text-white'
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={handleLike}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          </div>
        </section>
        <section className="md:max-w-md mx-auto mb-2">
          <p className="mt-8 text-lg w-full text-center font-bold">
            {singleCollectionData?.title}
          </p>
        </section>
        <section className="md:max-w-md mx-auto">
          <p className="mt-1.5 w-full text-center">
            {singleCollectionData?.category.name}
          </p>
        </section>
        <section className="md:max-w-md mx-auto mb-10">
          <p className="mt-1.5  w-full text-center">
            {singleCollectionData?.description}
          </p>
        </section>
        <div className="flex justify-center flex-col items-center">
          {/* display edit and delete buttons for the collection if the user is logged in and is the creator */}
          {isLogged && isCreator && (
            <>
              <div className="mb-3">
                <button
                  type="submit"
                  className="rounded-full bg-cyan-700 px-5 py-2.5 text-sm font-medium text-white shadow transition hover:scale-105 hover:shadow-xl focus:outline-none focus:ring active:bg-cyan-700"
                  onClick={navigateToEdit}
                >
                  Modifier ma collection
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="rounded-full bg-red-500 px-4 py-2.5 text-sm font-medium text-white shadow transition hover:scale-105 hover:shadow-xl focus:outline-none focus:ring active:bg-cyan-700"
                  onClick={toggleDeleteConfirmation}
                >
                  Supprimer ma collection
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full mx-auto md:col-span-2">
        <div className="flex items-center mx-auto mb-5 w-full justify-between md:max-w-2xl" />
        <img
          src={singleCollectionData?.picture}
          alt="couverture de la collection"
          className="rounded-xl w-full object-cover h-64 w-banner mx-auto mb-8 max-w-xl"
        />
        {singleCollectionData?.ressource.map((item, index) =>
          item.type === 0 ? (
            <RessourceURL
              key={index}
              url={item.url}
              images={item.images}
              title={item.title}
              description={item.description}
              hideDeleteButton={{ hideDeleteButton: true }}
            />
          ) : (
            <RessourceText
              key={index}
              text={item.content}
              hideDeleteButton={{ hideDeleteButton: true }}
            />
          )
        )}
      </div>
      {deletePopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md">
            <p className="text-lg font-semibold mb-4">
              Êtes-vous sûr de vouloir supprimer cette collection ?
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white mr-2 transition hover:scale-105 hover:shadow-xl focus:outline-none focus:ring active:bg-red-500"
                onClick={handleDeleteCollection}
              >
                Supprimer
              </button>
              <button
                type="button"
                className="rounded-full bg-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring active:bg-gray-300"
                onClick={toggleDeleteConfirmation}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleCollection;

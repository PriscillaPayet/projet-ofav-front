/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { ICollection, IUser } from '../../@types/interface';
import CollectionCard from '../CollectionCard/CollectionCard';
import Spinner from '../Spinner/Spinner';
import UserCard from '../UserCard/UserCard';

function UserCollections() {
  // retrieve the user ID from session storage.
  const userId = sessionStorage.getItem('id');

  // initialize state variables using useState hook
  const [singleUserData, setSingleUserData] = useState<IUser>();
  const [isLoading, setIsLoading] = useState(true);

  // callback function to fetch a single user's data.
  const fetchSingleUser = useCallback(async () => {
    try {
      // get request to retrieve one User datac
      const result = await axios.get(
        `http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/user/${userId}`
      );
      // update the state with the data we received from the API
      setSingleUserData(result.data);
      setIsLoading(false);
    } catch (error) {
      // display an error message in the console if no data is received
      // eslint-disable-next-line no-console
      console.error(
        "Une erreur s'est produite lors de la récupération de la User:",
        error
      );
    }
  }, [userId]);

  // useEffect to fetch the user's data when the component mounts.
  useEffect(() => {
    fetchSingleUser();
  }, [fetchSingleUser]);

  // variable to indicate if the collections belong to the current user.
  const isMyCollections = 'yes';

  // if data is still loading, render a spinner component.
  if (isLoading) {
    return <Spinner />;
  }

  // Render the UserCollections component with user card and collection cards.
  return (
    <div className="mx-auto p-8">
      <h1 className="text-2xl font-bold sm:text-3xl my-2">Mes Collections</h1>

      {/* Render the UserCard component with user data. */}
      <UserCard {...singleUserData!} />
      <div className="w-full p-7 my-5 pb-3 shadow-2xl mx-auto flex flex-row flex-wrap gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Map and render collection cards for the user's collections. */}
          {singleUserData!.card.map((card: ICollection) => (
            <CollectionCard
              key={card.id}
              {...card}
              myCollection={isMyCollections}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserCollections;

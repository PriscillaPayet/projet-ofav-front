/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ICollection, IUser } from '../../@types/interface';
import Spinner from '../Spinner/Spinner';
import CollectionCard from '../CollectionCard/CollectionCard';
import UserCard from '../UserCard/UserCard';

function SingleUser() {
  // get the 'id' parameter from the URL using 'useParams' from React Router
  const { id } = useParams();

  // initialize state variables using useState hook
  const [singleUserData, setSingleUserData] = useState<IUser>();
  const [isLoading, setIsLoading] = useState(true);

  // callback function to fetch a single user's data
  const fetchSingleUser = useCallback(async () => {
    try {
      // GET request to retrieve the user's data by ID
      const result = await axios.get(
        `http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/user/${id}`
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
  }, [id]);

  // useEffect to fetch the user's data when the component mounts
  useEffect(() => {
    fetchSingleUser();
  }, [fetchSingleUser]);

  // if data is still loading, render a Spinner component
  if (isLoading) {
    return <Spinner />;
  }

  // if the user has collections, render UserCard and CollectionCard components
  if (singleUserData?.card.length > 0) {
    return (
      <div className="mx-auto p-8">
        <UserCard {...singleUserData!} />
        <div className="w-full p-7 my-5 pb-3 shadow-2xl mx-auto flex flex-row flex-wrap gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {singleUserData!.card.map((card: ICollection) => (
              <CollectionCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  // if the user has no collections, render only the UserCard component
  return (
    <div className="mx-auto p-8">
      <UserCard {...singleUserData!} />
    </div>
  );
}

export default SingleUser;

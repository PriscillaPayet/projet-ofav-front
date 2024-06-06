/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';
import { useEffect, useState } from 'react';
import CollectionCard from '../CollectionCard/CollectionCard';
import { ICollection } from '../../@types/interface';
import './Home.scss';
import Spinner from '../Spinner/Spinner';
import organizing from '../../assets/organizing.svg';
import arrow from '../../assets/arrow.svg';

/* 
  Renders the home page with a random and latest collection,
  displaying a loading spinner while data is fetched.
*/
function Home() {
  // state to hold random and latest collections and loading state
  const [randomCollection, setRandomCollection] = useState<ICollection>();
  const [latestCollection, setLatestCollection] = useState<ICollection>();
  const [isLoading, setIsLoading] = useState(true);

  // function to fetch a random collection
  const fetchRandomCollection = async () => {
    try {
      // GET request to retrieve collections data
      const result = await axios.get(
        'http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/card/random'
      );
      // update the state with the data we received from collections
      setRandomCollection(result.data);
      setIsLoading(false);
    } catch (error) {
      // display an error message in the console if no data is received
      // eslint-disable-next-line no-console
      console.error(
        "Une erreur s'est produite lors de la récupération des collections:",
        error
      );
    }
  };

  // function to fetch the latest collection
  const fetchLatestCollection = async () => {
    try {
      // GET request to retrieve collections data
      const result = await axios.get(
        'http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/card/latest'
      );
      // update the state with the data we received from collections
      setLatestCollection(result.data);
      setIsLoading(false);
    } catch (error) {
      // display an error message in the console if no data is received
      // eslint-disable-next-line no-console
      console.error(
        "Une erreur s'est produite lors de la récupération des collections:",
        error
      );
    }
  };

  // useEffect to fetch random collection after the initial rendering
  useEffect(
    // callback
    () => {
      fetchRandomCollection();
    },
    // empty array = callback executed only after first rendering
    []
  );

  // useEffect to fetch latest collection after the initial rendering
  useEffect(
    // callback
    () => {
      fetchLatestCollection();
    },
    []
  );

  // render a loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className=" w-11/12 p-1 my-5 pb-3 mx-auto flex flex-col md:grid md:grid-cols-2 md:gap-0">
        <p className="flex items-center text-center mx-auto md:mx-0 text-xl md:text-2xl font-medium textColor">
          Construisez votre savoir, un clic à la fois.
        </p>
        <div className="w-11/12">
          <Spinner />
        </div>
      </div>
    );
  }

  // render the home page content once data is fetched
  return (
    <div className="w-11/12 p-1 mt-10 md:mt-20 mb-5 pb-3 mx-auto flex flex-col md:grid md:grid-cols-2 md:gap-0">
      <div className="flex flex-col items-center justify-center md:flex-col md:items-center md:mt-4">
        <p className="flex items-center text-center mx-auto md:mx-0 text-xl md:text-2xl font-medium textColor">
          Construisez votre savoir, un clic à la fois.
        </p>
        <img
          className="md:w-3/5 w-3/4 mt-5"
          src={organizing}
          alt="illustration d'une personne qui organise ses idées"
        />
      </div>
      <div className="mt-24 md:mt-0 md:flex md:flex-col md:items-center md:justify-center">
        <div className="md:flex md:items-center">
          <p className="md:mr-5 md:text-lg text-center font-medium textColor">
            Découvre la dernière collection publiée ici
          </p>
          <img
            src={arrow}
            alt="flèche qui pointe vers la collection"
            className="arrowImage mx-auto my-1"
          />
        </div>
        {latestCollection && (
          <div className="my-2">
            <CollectionCard {...latestCollection!} />
          </div>
        )}
        <div className="md:flex md:items-center">
          <p className="md:mr-5 md:text-lg text-center font-medium textColor">
            ou une collection au hasard ici
          </p>
          <img
            src={arrow}
            alt="flèche qui pointe vers la collection"
            className="arrowImage mx-auto my-1"
          />
        </div>
        {randomCollection && (
          <div className="my-2">
            <CollectionCard {...randomCollection!} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

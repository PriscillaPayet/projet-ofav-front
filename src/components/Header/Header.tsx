import axios from 'axios';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react'; // import state
import LogoOfav from '../../assets/LogoOfav.svg';
import AddButton from '../AddButton/AddButton';
import './Header.scss';
import axiosInstance from '../../axios/axios';
import { ILog } from '../../@types/interface';

function Header({ isLogged, setIsLogged }: ILog) {
  // initialize state variables
  const [isNavOpen, setIsNavOpen] = useState(false); // initiate isNavOpen state with false
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // initiate isDropdownOpen state with false -> with the menu closed
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userDataLoaded, setUserDataLoaded] = useState(false); // status to indicate if the user's data has been recovered

  // function to handle logout action
  const handleLogout = () => {
    // clear user-related data in sessionStorage
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('id');
    // update the isLogged state to indicate user is not logged in
    setIsLogged(false);
    // navigate to the login page
    navigate('/connexion');
  };

  // check if the user is already logged in when the component mounts
  useEffect(() => {
    // check if the token exists in local storage
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
      // token exists, set isLogged to true and add token to Axios headers
      setIsLogged(true);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${authToken}`;
    } else {
      // token does not exist, set isLogged to false
      setIsLogged(false);
    }
  }, [setIsLogged]);

  // function to fetch user data by their ID
  const userId = sessionStorage.getItem('id');
  const fetchUserById = useCallback(async () => {
    if (isLogged) {
      try {
        // GET request to retrieve a connected user data
        const result = await axios.get(
          `http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/user/${userId}`
        );
        // set the user's username and close the dropdown menu
        setUsername(result.data.username);
        setIsDropdownOpen(false);
      } catch (error) {
        // display an error message in the console if no data is received
        // eslint-disable-next-line no-console
        console.error(
          "Une erreur s'est produite lors de la récupération de l'utilisateur:",
          error
        );
      }
    }
  }, [isLogged, userId]);

  // fetch user data when the component mounts
  useEffect(
    // callback
    () => {
      // after the first rendering, we fetch the posts and update the state
      fetchUserById()
        .then(() => setUserDataLoaded(true))
        .catch(() => setUserDataLoaded(false));
    },
    [fetchUserById]
  );

  return (
    <header className="bg-slate-100">
      <div className=" mx-auto max-w-screen-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <Link
              className="block text-teal-600"
              onClick={() => setIsNavOpen(false)}
              to="/"
            >
              <span className="sr-only">Accueil</span>
              <img
                className="h-32
              "
                src={LogoOfav}
                alt="Logo O'Fav"
              />
            </Link>
          </div>
          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <NavLink
                    to="/collections"
                    className="text-gray-500 transition hover:text-gray-500/75"
                  >
                    Collections
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/utilisateurs"
                    className="text-gray-500 transition hover:text-gray-500/75"
                  >
                    Utilisateurs
                  </NavLink>
                </li>
              </ul>
            </nav>
            <div className="hidden md:block">{isLogged && <AddButton />}</div>
            <div className="flex items-center gap-4">
              {isLogged && (
                <div className="sm:flex sm:gap-4 m-3">
                  <button
                    type="button"
                    className="rounded-md bg-cyan-700 px-5 py-2.5 text-sm font-medium text-white shadow"
                    onClick={() => setIsDropdownOpen((prev) => !prev)} // toggle
                  >
                    {username}
                  </button>
                  {isDropdownOpen && username && (
                    // Render the dropdown if isDropdownOpen is true
                    <div className="absolute right-0 md:mt-10 w-48 bg-slate-100 rounded-lg shadow-lg z-10">
                      <ul className="py-5">
                        <li>
                          <Link
                            to="/mon-profil"
                            className="block w-full px-4 py-3 text-sm text-gray-500 hover:bg-gray-100 text-center"
                          >
                            Mon profil
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="block w-full px-4 py-3 text-sm text-gray-500 hover:bg-gray-100 text-center"
                            to="/mes-collections"
                          >
                            Mes collections
                          </Link>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="block w-full font-bold px-4 py-3 text-sm text-gray-500 hover:bg-gray-100"
                            onClick={
                              handleLogout
                              // Handle "Se déconnecter" click action here
                              // For example, perform logout logic
                            }
                          >
                            Se déconnecter
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {!isLogged && (
                <div className="sm:flex sm:gap-4 m-3">
                  <Link
                    className="rounded-md bg-cyan-700 px-5 py-2.5 text-sm font-medium text-white shadow"
                    to="/connexion"
                  >
                    Se connecter
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="block md:hidden">
            <button
              type="button"
              className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
              onClick={() => setIsNavOpen((prev) => !prev)} // toggle isNavOpen state on click
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div
              className={
                isNavOpen
                  ? 'showMenuNav absolute right-0 md:mt-10 w-48 bg-slate-100 rounded-lg shadow-lg z-10'
                  : 'hideMenuNav'
              }
            >
              <ul className="MENU-LINK-MOBILE-OPEN rounded-lg shadow-lgflex flex-col items-center justify-evenly">
                <li className="text-gray-500  transition hover:text-gray-500/75 my-8">
                  <NavLink
                    to="/collections"
                    onClick={() => setIsNavOpen(false)} // on click menu is hidden
                    className=""
                  >
                    Collections
                  </NavLink>
                </li>
                <li className="text-gray-500 transition hover:text-gray-500/75 mb-8">
                  <NavLink
                    to="/utilisateurs"
                    onClick={() => setIsNavOpen(false)} // on click menu is hidden
                  >
                    Utilisateurs
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="block fixed bottom-12 right-4 z-40 md:hidden ">
        {isLogged && <AddButton />}
      </div>
    </header>
  );
}
export default Header;

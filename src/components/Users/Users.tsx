import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from '../UserCard/UserCard';
import { IUser, IUsers } from '../../@types/interface';
import Spinner from '../Spinner/Spinner';
import Pagination from '../Pagination/Pagination';
import SearchBar from '../SearchBar/SearchBar';

function Users() {
  const [usersData, setUsersData] = useState<IUsers>({ users: [] });
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(9);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IUsers>({ users: [] });

  // Function to fetch user data from an API.
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        'http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/user/all'
      );
      const { data } = response;
      setUsersData(data);
      setIsLoading(false);
    } catch (error) {
      // Handle and log errors if the API request fails.
      // eslint-disable-next-line no-console
      console.error(
        "Une erreur s'est produite lors de la récupération des users:",
        error
      );
      setIsLoading(false);
    }
  };

  // useEffect to fetch user data when the component mounts.
  useEffect(() => {
    fetchUsers();
  }, []);

  // useEffect to filter users based on search query.
  useEffect(() => {
    const filteredUsers = usersData?.users.filter((user) => {
      const lowerCaseName = user.username.toLowerCase();
      const lowerCaseQuery = searchQuery.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery);
    });

    setSearchResults({ users: filteredUsers || [] });
  }, [searchQuery, usersData]);

  // Calculate the range of users to display on the current page.
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = searchResults.users.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  // Function to handle page number changes.
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // If data is still loading, render a spinner component.
  if (isLoading) {
    return <Spinner />;
  }

  // Render the users component with user cards, search bar, and pagination.
  return (
    <div className="w-11/12 p-1 my-5 pb-3 drop-shadow-Collection mx-auto">
      <h1 className="text-center text-3xl font-bold my-4">Les utilisateurs</h1>
      <p className="text-center my-2">
        Découvrez l&apos;ensemble des auteurs qui partagent des collections
      </p>
      <SearchBar onSearch={setSearchQuery} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {currentUsers.map((user: IUser) => {
          return <UserCard {...user} key={user.id} />;
        })}
      </div>
      {searchResults.users.length > usersPerPage && (
        <Pagination
          collectionsPerPage={usersPerPage}
          totalCollections={searchResults.users.length}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default Users;

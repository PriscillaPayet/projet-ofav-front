import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Users from '../Users/Users';
import SingleUser from '../SingleUser/SingleUser';
import Collections from '../Collections/Collections';
import Creation from '../CreationCollection/Creation';
import NotFound from '../NotFound/NotFound';
import Home from '../Home/Home';
import SingleCollection from '../SingleCollection/SingleCollection';
import LegalNotices from '../LegalNotices/LegalNotices';

import './App.scss';
import ProfilSettings from '../ProfilSettings/ProfilSettings';
import UserCollections from '../UserCollections/UserCollections';
import EditCollection from '../EditCollection/EditCollection';
import ScrollToTopOnPageChange from '../ScrollToTopOnPageChange/ScrollToTopOnPageChange';

function App() {
  const [isLogged, setIsLogged] = useState(false); // initiate isLogged state with false
  const navigate = useNavigate();

  // function to handle login action
  const handleLogin = (authToken: string) => {
    // set isLogged to true when logged in.
    setIsLogged(true);
    // store the authentication token in session storage.
    sessionStorage.setItem('authToken', authToken);
    // redirect to the collections page after login.
    navigate('/collections');
  };

  return (
    <div className="App">
      <Header isLogged={isLogged} setIsLogged={setIsLogged} />
      <main className="flex flex-col min-h-screen">
        <ScrollToTopOnPageChange />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/utilisateurs" element={<Users />} />
          <Route path="/utilisateur/:id" element={<SingleUser />} />
          <Route
            path="/connexion"
            element={<Login onLoginSuccess={handleLogin} />}
          />
          <Route path="/inscription" element={<Register />} />

          <Route
            path="/mon-profil"
            element={
              isLogged ? (
                <ProfilSettings />
              ) : (
                <Login onLoginSuccess={handleLogin} />
              )
            }
          />
          <Route
            path="/mes-collections"
            element={
              isLogged ? (
                <UserCollections />
              ) : (
                <Login onLoginSuccess={handleLogin} />
              )
            }
          />
          <Route path="/collections" element={<Collections />} />
          <Route
            path="/collection/:id"
            element={
              <SingleCollection isLogged={isLogged} setIsLogged={setIsLogged} />
            }
          />
          <Route
            path="/modification-collection/:collectionId"
            element={
              isLogged ? (
                <EditCollection />
              ) : (
                <Login onLoginSuccess={handleLogin} />
              )
            }
          />
          <Route
            path="/creation-collection"
            element={
              isLogged ? (
                <Creation isLogged={isLogged} setIsLogged={setIsLogged} />
              ) : (
                <Login onLoginSuccess={handleLogin} />
              )
            }
          />
          <Route path="/mentions-legales" element={<LegalNotices />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

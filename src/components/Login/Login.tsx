import { Link } from 'react-router-dom';
import { useState } from 'react';
import axiosInstance from '../../axios/axios';

interface LoginProps {
  onLoginSuccess: (authToken: string, id: string) => void;
}

function Login({ onLoginSuccess }: LoginProps) {
  // state for controlling password visibility and handling input values and errors
  const [showPassword, setShowPassword] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [error, setError] = useState<string>('');

  // function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // function to handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(''); // Clear any previous error before making the request
    try {
      // POST request to to authenticate the user
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await axiosInstance
        .post('api/login_check', {
          email: emailValue,
          password: passwordValue,
        })
        .then((response) => {
          // extract the token  and user id from the response data
          const authToken = response.data.token;
          const { id } = response.data;
          // call the parent component's function to update isLogged state
          onLoginSuccess(authToken, id);
          // store the token  and user id in the sessionStorage
          sessionStorage.setItem('authToken', authToken);
          sessionStorage.setItem('id', id);

          // set the token in the axiosInstance headers for future requests
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${authToken}`;
        });
      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (error: any) {
      // display an error message in the console if no data is received
      if (error.response) {
        // the request was made, but the server responded with an error status code
        if (error.response.status === 401) {
          setError('Email ou mot de passe invalide. Veuillez réessayer.');
        } else {
          setError(
            'Une erreur est survenue, veuillez réessayer ultérieurement.'
          );
        }
      } else if (error.request) {
        // the request was made, but no response was received from the server
        setError(
          'Pas de réponse du serveur, veuillez réessayer ultérieurement.'
        );
      } else {
        // something else happened during the request
        setError('Une erreur est survenue, veuillez réessayer ultérieurement.');
      }
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8" />
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Bienvenue!</h1>
        <p className="mt-4 text-gray-500 text-center">
          Pour accéder à votre compte, renseignez vos identifiants.
        </p>
      </div>

      <form
        action=""
        className="mx-auto mb-0 mt-8 max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>

          <div className="relative">
            <input
              type="email"
              id="email"
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
            />

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Mot de passe
          </label>

          <div className="relative">
            <label htmlFor="mdp" className="sr-only">
              Mot de passe
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="mdp"
              placeholder="Mot de passe"
              className="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 end-0 grid place-content-center px-4 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </div>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex items-center justify-between">
          <Link to="/inscription">
            <p className="text-sm text-gray-500">
              Pas encore de compte?
              <span className="hover:underline text-cyan-700">
                {' '}
                S&apos;inscrire
              </span>
            </p>
          </Link>

          <button
            type="submit"
            className="inline-block rounded-lg bg-cyan-700 px-5 py-3 text-sm font-medium text-white"
            onSubmit={handleSubmit}
          >
            Se connecter
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;

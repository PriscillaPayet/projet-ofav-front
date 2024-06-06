import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../../@types/interface';
import Spinner from '../Spinner/Spinner';

function ProfilSettings() {
  // get user ID and authentication token from session storage
  const userId = sessionStorage.getItem('id');
  const authToken = sessionStorage.getItem('authToken');

  // state variables for managing various form elements and messages
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [profilSettingsData, setProfilSettingsData] = useState<
    IUser | undefined
  >();
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [usernameValue, setUsernameValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [selectedImageBlob, setSelectedImageBlob] = useState<
    Blob | undefined
  >();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(
    ''
  );

  // when user data is available, populate email and username fields
  useEffect(() => {
    if (profilSettingsData) {
      setEmailValue(profilSettingsData.email);
      setUsernameValue(profilSettingsData.username);
    }
  }, [profilSettingsData]);

  // function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // handle changes to the selected profile image
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageBlob(file);
      setSelectedImageUrl(URL.createObjectURL(file));
    }
  };

  // function to fetch user settings from the server
  const fetchUserSettings = useCallback(async () => {
    try {
      if (userId) {
        // GET request to fetch user data
        const result = await axios.get(
          `http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/user/${userId}`
        );
        setProfilSettingsData(result.data);
      }
      setIsLoading(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      // handle errors during data fetch
      console.error(
        "Une erreur s'est produite lors de la récupération de la User:",
        error
      );
    }
  }, [userId]);

  // fetch user settings when the component mounts
  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  // handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // check if the entered passwords match
    if (passwordValue !== confirmPasswordValue) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }
    // regex to check password complexity
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(passwordValue)) {
      setErrorMessage(
        'Le mot de passe doit comporter au moins 8 caractères, une majuscule et un chiffre.'
      );
      return;
    }

    // regex to check if valid email address
    const isValidEmailRegex = /\S+@\S+\.\S+/;
    if (!isValidEmailRegex.test(emailValue)) {
      setErrorMessage("L'adresse email est invalide");
      return;
    }

    try {
      // prepare form data for the POST request
      const formData = {
        email: emailValue,
        password: passwordValue,
        username: usernameValue,
        picture: profilSettingsData?.picture,
      };

      if (selectedImageBlob) {
        // if a new profile picture is selected, convert it to base64
        const fileReader = new FileReader();
        fileReader.onload = async (event) => {
          if (event.target && event.target.result) {
            const base64Image = event.target.result.toString();
            formData.picture = base64Image;
            // POST request to update user data
            await axios.post(
              `http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/user/${userId}/update`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                  'Content-Type': 'application/json',
                },
              }
            );
          }
        };
        fileReader.readAsDataURL(selectedImageBlob);
        navigate('/');
      } else {
        // if no new profile picture is selected, send the request without an image
        await axios.post(
          `http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/user/${userId}/update`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }
      // display a success message and navigate to the homepage
      setSuccessMessage('Modification réussie !');
      navigate('/');
    } catch (error: any) {
      if (error.response) {
        // eslint-disable-next-line no-console
        console.error('Erreur de réponse du serveur:', error.response.data);
        if (error.response.status === 409) {
          setErrorMessage('Adresse e-mail déjà existante.');
        } else {
          setErrorMessage("Une erreur s'est produite lors de la requête.");
        }
      } else {
        // eslint-disable-next-line no-console
        console.error('Erreur de la requête:', error.message);
      }
    }
  };

  // if data is still loading, display a spinner
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="relative mt-8 mx-8 md:max-w-screen-sm md:mx-auto">
      <h1 className="text-center text-2xl font-bold my-4">Mon profil</h1>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form action="" onSubmit={handleSubmit}>
        <section className="mb-3">
          <img
            src={profilSettingsData?.picture}
            alt=""
            className="w-24 h-24 rounded-full mx-auto"
          />
          <div className="mx-auto mb-7 max-w-md">
            <label
              htmlFor="example1"
              className="text-center mb-1 block text-sm font-medium text-gray-700"
            >
              Sélectionnez votre photo de profil
            </label>
            <input
              id="example1"
              type="file"
              onChange={handleImageChange}
              className="border border-light-grey-700 rounded-md text-gray-700 mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-cyan-700 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60"
            />
          </div>
        </section>
        <div>
          Email
          <label htmlFor="Email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            id="Email"
            placeholder={profilSettingsData?.email}
            className="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          />
        </div>

        <div>
          Mot de passe
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
        <div>
          Mot de passe{' '}
          <span className="italic text-slate-400">- confirmation -</span>
          <div className="relative">
            <label htmlFor="mdpConfirm" className="sr-only">
              Confirmez le mot de passe
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="mdpConfirm"
              placeholder="Confirmez le mot de passe"
              className="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm"
              value={confirmPasswordValue}
              onChange={(e) => setConfirmPasswordValue(e.target.value)}
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
        <div>
          Pseudo
          <label htmlFor="username" className="sr-only">
            Pseudo
          </label>
          <input
            type="text"
            id="username"
            className="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm"
            value={usernameValue}
            onChange={(e) => setUsernameValue(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 snap-center">
          <div className="sm:flex mx-auto sm:gap-4  m-3">
            <button
              type="submit"
              className="rounded-md bg-cyan-700 px-5 py-2.5 text-sm font-medium text-white shadow"
            >
              Modifier mes informations
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProfilSettings;

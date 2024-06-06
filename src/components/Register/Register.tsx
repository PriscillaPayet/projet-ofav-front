import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();

  // state for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // state variables for form input values
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [usernameValue, setUsernameValue] = useState('');

  // state for error and success messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');

  // state for image selection
  const [imagesVisible, setImagesVisible] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(1);

  // function to handle image selection
  const handleImageSelect = (imageId: number) => {
    setSelectedImageId(imageId);
  };

  // state for selected image (blob and URL)
  const [selectedImageBlob, setSelectedImageBlob] = useState<
    Blob | undefined
  >();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(
    ''
  );

  // function to handle image file change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageBlob(file);
      setSelectedImageUrl(URL.createObjectURL(file));
    }
  };

  // function to handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // check if the entered passwords match
    if (passwordValue !== confirmPasswordValue) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    // Regex to validate password strength : at least 8 characters, one uppercase and one number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    // check if the password meets the criteria
    if (!passwordRegex.test(passwordValue)) {
      setErrorMessage(
        'Le mot de passe doit comporter au moins 8 caractères, une majuscule et un chiffre.'
      );
      return;
    }

    try {
      const formData = {
        email: emailValue,
        password: passwordValue,
        username: usernameValue,
        picture: `${selectedImageId}`,
      };

      if (selectedImageBlob) {
        // read the selected image as a base64 string
        const fileReader = new FileReader();
        fileReader.onload = async (event) => {
          if (event.target && event.target.result) {
            const base64Image = event.target.result.toString();
            formData.picture = base64Image;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // POST request to register the user with the selected image
            const result = await axios.post(
              'http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/user/add',
              formData
            );
          }
        };
        fileReader.readAsDataURL(selectedImageBlob);
        // set a success message and navigate to the login page
        setSuccessMessage('Inscription réussie !');
        navigate('/connexion');
      } else {
        await axios.post(
          'http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/user/add',
          formData
        );
        setSuccessMessage('Inscription réussie !');
        navigate('/connexion');
      }
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

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Inscription</h1>

        <p className="mt-4 text-gray-500 text-center">
          Pour créer votre compte, renseignez vos informations.
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
              {/* Show/hide password button icon */}
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
              {/* Show/hide password button icon */}
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
          <label htmlFor="text" className="sr-only">
            Pseudo
          </label>

          <div className="relative">
            <input
              type="text"
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Nom d'utilisateur"
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value)}
            />
          </div>
        </div>
        <div>
          {/* Add a button to toggle the visibility of images */}
          <div className="mb-4">
            <p className="font-medium text-sm mb-2">
              Choisissez une image de profil :
            </p>
            <button
              type="button"
              className="inline-block px-4 py-2 bg-cyan-600 text-white rounded-lg shadow-sm"
              onClick={() => setImagesVisible(!imagesVisible)}
            >
              {imagesVisible ? 'Cacher les images' : 'Afficher les images'}
            </button>
          </div>
          {imagesVisible && (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((imageId) => (
                <button
                  key={imageId}
                  type="button"
                  className={`relative w-full rounded-lg border-gray-200 overflow-hidden ${
                    selectedImageId === imageId ? 'ring ring-blue-500' : ''
                  }`}
                  onClick={() => handleImageSelect(imageId)}
                >
                  <img
                    src={`/projet-o-fav-front/src/assets/profil${imageId}.png`}
                    alt={`Profile ${imageId}`}
                    className="h-20 mx-auto"
                  />
                  {selectedImageId === imageId && (
                    <span className="absolute inset-0 bg-cyan-600 opacity-30" />
                  )}
                </button>
              ))}
            </div>
          )}
          <div>
            <p className="font-medium text-sm mb-2 ">
              Ou importez une image de profil :
            </p>
            <input
              type="file"
              onChange={handleImageChange}
              className="border border-light-grey-700 rounded-md text-gray-700 mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-cyan-700 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60 "
            />
          </div>
        </div>
        {errorMessage && (
          <div className="text-red-600 my-2">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-600 my-2">{successMessage}</div>
        )}
        <div className="flex items-center justify-between">
          <Link to="/connexion">
            <p className="text-sm text-gray-500">
              Vous avez déjà un compte?
              <span className="hover:underline text-cyan-700">
                {' '}
                Se connecter
              </span>
            </p>
          </Link>

          <button
            type="submit"
            className="inline-block rounded-lg bg-cyan-700 px-5 py-3 text-sm font-medium text-white"
          >
            S&apos;inscrire
          </button>
        </div>
      </form>
    </div>
  );
}
export default Register;

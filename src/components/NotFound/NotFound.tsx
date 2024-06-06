import { Link } from 'react-router-dom';

// function to display a 404 error page
function NotFound() {
  return (
    <div className="grid h-screen px-4 bg-white place-content-center">
      <div className="text-center">
        <h1 className="font-black text-gray-200 text-9xl">404</h1>

        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Oups!
        </p>

        <p className="mt-4 text-gray-500">Cette page n&apos;existe pas.</p>

        <Link
          to="/"
          className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-cyan-600 rounded hover:bg-cyan-800 focus:outline-none focus:ring"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

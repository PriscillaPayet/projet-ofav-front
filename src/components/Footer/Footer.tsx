import { Link } from 'react-router-dom';
import './Footer.scss';

function Footer() {
  return (
    <footer className="footer bg-slate-100 bottom-0 left-0 right-0 footer-center w-full p-4  text-gray-800">
      <div className="text-center text-xs ">
        <Link to="/mentions-legales">
          Mentions Légales <span className="font-semibold">O&apos;Fav</span>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;

import { Link } from 'react-router-dom';
import { IUser } from '../../@types/interface';

// function to display the user's profile picture, username, and provide a link to the user's profile page.
function UserCard({ id, username, picture }: IUser) {
  return (
    <div>
      <Link to={`/utilisateur/${id}`}>
        <div className="relative flex flex-col md:flex-column space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-xs mx-auto border border-white bg-white text-center">
          <img
            src={picture}
            alt=""
            className="w-16 h-16 rounded-full mx-auto"
          />
          <h2 className="text-l font-semibold mt-3">{username}</h2>
        </div>
      </Link>
    </div>
  );
}

export default UserCard;

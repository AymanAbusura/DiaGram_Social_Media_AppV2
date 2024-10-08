import { Models } from "appwrite";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";
import { useTheme } from '@/context/ThemeContext';

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="user-card">
      <Link to={`/profile/${user.$id}`} className="user-card-link">
        <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="creator" className="rounded-full w-14 h-14" />
      </Link>
      <div className="flex-center flex-col gap-1">
        <p className={`lex base-medium text-center line-clamp-1 ${isDarkMode ? 'text-light-1' : 'text-black-1'}`}>
          {user.name}
          {user.label === 'Verified' && <img src="/assets/icons/verify.svg" alt="verify" width={20} height={20} />}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>
      <FollowButton targetUserId={user.$id} />
    </div>
  );
};

export default UserCard;
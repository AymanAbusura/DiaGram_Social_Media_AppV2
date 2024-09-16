import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { useFollowContext } from '@/context/FollowContext';
import { useTheme } from '@/context/ThemeContext';

type FollowButtonProps = {
  targetUserId: string;
};

const FollowButton = ({ targetUserId }: FollowButtonProps) => {
  const { isFollowing, followUser, unfollowUser } = useFollowContext();
  const [isFollowingState, setIsFollowingState] = useState<boolean>(false);

  const { isDarkMode } = useTheme();

  // Sync the follow state when the component mounts or `targetUserId` changes
  useEffect(() => {
    setIsFollowingState(isFollowing(targetUserId));
  }, [isFollowing, targetUserId]);

  const handleFollowClick = async () => {
    if (isFollowingState) {
      await unfollowUser(targetUserId);
      setIsFollowingState(false);
    } else {
      await followUser(targetUserId);
      setIsFollowingState(true);
    }
  };

  return (
    <Button
      onClick={handleFollowClick}
      className={`px-4 py-2 rounded 
        ${isFollowingState ? `bg-white text-black` : 'shad-button_primary'} 
        ${isFollowingState ? `text-black` : 'text-white'}
        ${isDarkMode ? `bg-white text-black` : `bg-black text-white`}
        `
      }
    >
      {isFollowingState ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default FollowButton;
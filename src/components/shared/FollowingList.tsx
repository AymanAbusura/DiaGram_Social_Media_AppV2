import { useEffect, useState } from 'react';
import { databases } from '@/lib/appwrite/config';
import Loader from '@/components/shared/Loader';

interface FollowingListProps {
  followingIds: string[];  // Array of following user IDs
}

interface User {
  id: string;
  name: string;
  imageUrl: string;
}

const FollowingList = ({ followingIds }: FollowingListProps) => {
  const [followingUsers, setFollowingUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID as string;
  const usersCollectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID as string; // Assuming there's a collection for users

  const fetchFollowingDetails = async () => {
    try {
      setIsLoading(true);

      const promises = followingIds.map(async (followingId) => {
        const response = await databases.getDocument(databaseId, usersCollectionId, followingId);
        return {
          id: response.$id,
          name: response.name,
          imageUrl: response.imageUrl || '/assets/icons/profile-placeholder.svg',
        };
      });

      const users = await Promise.all(promises);
      setFollowingUsers(users);
    } catch (error) {
      console.error('Error fetching following user details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (followingIds.length > 0) {
      fetchFollowingDetails();
    }
  }, [followingIds]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ul className="following-list">
      {followingUsers.length > 0 ? (
        followingUsers.map((user) => (
          <li key={user.id} className="following-item flex gap-4 items-center">
            <img
              src={user.imageUrl}
              alt={`${user.name}'s profile`}
              className="w-10 h-10 rounded-full"
            />
            <p className="following-name small-medium md:body-medium">{user.name}</p>
          </li>
        ))
      ) : (
        <h3 className="body-bold md:h3-bold w-full my-10">No users followed yet</h3>
      )}
    </ul>
  );
};

export default FollowingList;

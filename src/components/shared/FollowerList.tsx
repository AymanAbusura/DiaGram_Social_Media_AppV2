import { useEffect, useState } from 'react';
import { databases } from '@/lib/appwrite/config';
// import { Query } from 'appwrite';
import Loader from '@/components/shared/Loader';

interface FollowerListProps {
  followerIds: string[];  // Array of follower user IDs
}

interface User {
  id: string;
  name: string;
  imageUrl: string;
}

const FollowerList = ({ followerIds }: FollowerListProps) => {
  const [followers, setFollowers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID as string;
  const usersCollectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID as string; // Assuming there's a collection for users

  // Fetch the follower user details based on follower IDs
  const fetchFollowerDetails = async () => {
    try {
      setIsLoading(true);

      // For each followerId, fetch user details from the users collection
      const promises = followerIds.map(async (followerId) => {
        const response = await databases.getDocument(databaseId, usersCollectionId, followerId);
        return {
          id: response.$id,
          name: response.name,
          imageUrl: response.imageUrl || '/assets/icons/profile-placeholder.svg',
        };
      });

      const users = await Promise.all(promises);
      setFollowers(users);
    } catch (error) {
      console.error('Error fetching follower details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (followerIds.length > 0) {
      fetchFollowerDetails();
    }
  }, [followerIds]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ul className="follower-list">
      {followers.length > 0 ? (
        followers.map((user) => (
          <li key={user.id} className="follower-item flex gap-4 items-center">
            <img
              src={user.imageUrl}
              alt={`${user.name}'s profile`}
              className="w-10 h-10 rounded-full"
            />
            <p className="follower-name small-medium md:body-medium">{user.name}</p>
          </li>
        ))
      ) : (
        <h3 className="body-bold md:h3-bold w-full my-10">No followers yet</h3>
      )}
    </ul>
  );
};

export default FollowerList;

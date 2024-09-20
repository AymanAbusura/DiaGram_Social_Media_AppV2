import { useEffect, useState } from 'react';
import { useFollowContext } from '@/context/FollowContext';
import { databases } from '@/lib/appwrite/config';
import { Query } from 'appwrite';

interface User {
  id: string;
  name: string;
  imageUrl: string;
}

const Follower = () => {
  const { currentUserId, followersCount } = useFollowContext();
  const [followerList, setFollowerList] = useState<User[]>([]);

  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID as string;
  const followersCollectionId = import.meta.env.VITE_APPWRITE_FOLLOWERS_COLLECTION_ID as string; // Collection for follower relations
  const usersCollectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID as string; // Collection for user data

  useEffect(() => {
    const fetchFollowerList = async () => {
      if (!currentUserId) return;

      try {
        // Step 1: Fetch the list of follower IDs
        const followResponse = await databases.listDocuments(databaseId, followersCollectionId, [
          Query.equal('followingId', currentUserId),
        ]);

        const followerIds = followResponse.documents.map((doc) => doc.followerId);

        // Step 2: Fetch follower user details (name, imageUrl)
        const followerDetails = await Promise.all(
          followerIds.map(async (userId) => {
            const userResponse = await databases.getDocument(databaseId, usersCollectionId, userId);
            return {
              id: userResponse.$id,
              name: userResponse.name,
              imageUrl: userResponse.imageUrl || '/assets/icons/profile-placeholder.svg',
            };
          })
        );

        setFollowerList(followerDetails);
      } catch (error) {
        console.error('Error fetching follower list:', error);
      }
    };

    fetchFollowerList();
  }, [currentUserId, databaseId, followersCollectionId, usersCollectionId]);

  return (
    <div className="follow-container">
      <div className="following-container">
      <h2 className="h3-bold md:h2-bold text-left w-full">Followers ({followersCount})</h2>
      <ul>
        {followerList.length > 0 ? (
          followerList.map((user) => (
            <li key={user.id} className="flex gap-4 items-center">
              <img
                src={user.imageUrl}
                alt={`${user.name}'s profile`}
                className="w-10 h-10 rounded-full"
              />
              <p className="small-medium md:body-medium">{user.name}</p>
            </li>
          ))
        ) : (
          <h3 className="text-light-4 mt-10 text-center w-full">No followers yet</h3>
        )}
      </ul>
    </div>
    </div>
  );
};

export default Follower;

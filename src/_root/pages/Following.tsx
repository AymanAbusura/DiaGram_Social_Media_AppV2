import { useEffect, useState } from 'react';
import { useFollowContext } from '@/context/FollowContext';
import { databases } from '@/lib/appwrite/config';
import { Query } from 'appwrite';
import FollowButton from '@/components/shared/FollowButton';

interface User {
  id: string;
  name: string;
  imageUrl: string;
}

const Following = () => {
  const { currentUserId, followingCount } = useFollowContext();
  const [followingList, setFollowingList] = useState<User[]>([]);

  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID as string;
  const followersCollectionId = import.meta.env.VITE_APPWRITE_FOLLOWERS_COLLECTION_ID as string; // Collection storing follow relations
  const usersCollectionId = import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID as string; // Collection storing user data

  useEffect(() => {
    const fetchFollowingList = async () => {
      if (!currentUserId) return;

      try {
        // Fetch users the current user is following
        const followResponse = await databases.listDocuments(databaseId, followersCollectionId, [
          Query.equal('followerId', currentUserId),
        ]);

        const followingUserIds = followResponse.documents.map((doc) => doc.followingId);

        // Fetch user details for each following user
        const followingUserDetails = await Promise.all(
          followingUserIds.map(async (userId) => {
            const userResponse = await databases.getDocument(databaseId, usersCollectionId, userId);
            return {
              id: userResponse.$id,
              name: userResponse.name,
              imageUrl: userResponse.imageUrl || '/assets/icons/profile-placeholder.svg',
            };
          })
        );

        console.log(followingUserDetails);

        setFollowingList(followingUserDetails);
      } catch (error) {
        console.error('Error fetching following list:', error);
      }
    };

    fetchFollowingList();
  }, [currentUserId, databaseId, followersCollectionId, usersCollectionId]);

  return (
    <div className="follow-container">
      <div className="following-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">Following ({followingCount})</h2>
        <ul>
          {followingList.length > 0 ? (
            followingList.map((user) => (
              <li key={user.id} className="flex gap-5 items-center md:gap-5 lg:gap-9">
                <div className='flex gap-2 items-center'>
                  <img
                    src={user.imageUrl}
                    alt={`${user.name}'s profile`}
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="small-medium md:body-medium">{user.name}</p>
                </div>
                <FollowButton targetUserId={user.id} />
              </li>
            ))
          ) : (
            <h3 className="text-light-4 mt-10 text-center w-full">No users followed yet</h3>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Following;

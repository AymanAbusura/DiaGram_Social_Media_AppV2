// import { createContext, useContext, useEffect, useState } from 'react';
// import { databases, account } from '@/lib/appwrite/config'; // Assuming you have AppwriteService.js configured
// import { ID, Query } from 'appwrite';

// // Context type to define the structure of the context
// interface FollowContextType {
//   isFollowing: (targetUserId: string) => boolean;
//   followUser: (targetUserId: string) => Promise<void>;
//   unfollowUser: (targetUserId: string) => Promise<void>;
//   followersCount: number;
//   followingCount: number;
// }

// interface FollowProviderProps {
//   children: React.ReactNode;
// }

// // Create FollowContext with default values for safety
// const FollowContext = createContext<FollowContextType>({
//   isFollowing: () => false,
//   followUser: async () => {},
//   unfollowUser: async () => {},
//   followersCount: 0,
//   followingCount: 0,
// });

// /**
//  * Hook to use the FollowContext, ensuring it's within a provider.
//  */
// // eslint-disable-next-line react-refresh/only-export-components
// export const useFollowContext = (): FollowContextType => {
//   const context = useContext(FollowContext);
//   if (!context) {
//     throw new Error('useFollowContext must be used within a FollowProvider');
//   }
//   return context;
// };

// // FollowProvider component to manage following/unfollowing logic
// export const FollowProvider = ({ children }: FollowProviderProps): JSX.Element => {
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
//   const [followedUsers, setFollowedUsers] = useState<string[]>([]);
//   const [followersCount, setFollowersCount] = useState<number>(0);
//   const [followingCount, setFollowingCount] = useState<number>(0);

//   // Variables related to Appwrite's Database and Collection IDs
//   const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID as string;
//   const collectionId = import.meta.env.VITE_APPWRITE_FOLLOWERS_COLLECTION_ID as string;

//   // Fetch current logged-in user on mount
//   useEffect(() => {
//     let isMounted = true; // To handle cleanup and avoid memory leaks

//     const fetchUser = async (): Promise<void> => {
//       try {
//         const user = await account.get();
//         if (isMounted) {
//           setCurrentUserId(user.$id);
//         }
//       } catch (error) {
//         console.error('Error fetching user:', error);
//       }
//     };

//     fetchUser();

//     // Cleanup function to prevent memory leaks
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Fetch the list of users the current user is following
//   useEffect(() => {
//     let isMounted = true;

//     const fetchFollowedUsers = async (): Promise<void> => {
//       if (!currentUserId) return;

//       try {
//         // Get the list of users the current user is following
//         const followingResponse = await databases.listDocuments(databaseId, collectionId, [
//           Query.equal('followerId', currentUserId),
//         ]);
//         const followed = followingResponse.documents.map((doc) => doc.followingId);

//         if (isMounted) {
//           setFollowedUsers(followed);
//           setFollowingCount(followingResponse.total); // Count of users the current user is following
//         }

//         // Get the number of users following the current user
//         const followersResponse = await databases.listDocuments(databaseId, collectionId, [
//           Query.equal('followingId', currentUserId),
//         ]);

//         if (isMounted) {
//           setFollowersCount(followersResponse.total); // Count of users following the current user
//         }
//       } catch (error) {
//         console.error('Error fetching followed and followers users:', error);
//       }
//     };

//     fetchFollowedUsers();

//     return () => {
//       isMounted = false;
//     };
//   }, [currentUserId, databaseId, collectionId]);

//   // Check if the user is already following the target user
//   const isFollowing = (targetUserId: string): boolean => {
//     return followedUsers.includes(targetUserId);
//   };

//   // Function to follow a user
//   const followUser = async (targetUserId: string): Promise<void> => {
//     if (!currentUserId) return; // Prevent actions without a logged-in user

//     try {
//       // Create a follow relationship document
//       await databases.createDocument(databaseId, collectionId, ID.unique(), {
//         followerId: currentUserId,
//         followingId: targetUserId,
//       });
      
//       // Update followed users list and counts
//       setFollowedUsers((prev) => [...prev, targetUserId]);
//       setFollowingCount((prev) => prev + 1); // Increment the following count

//       // Increment followers count for the target user
//       const followersResponse = await databases.listDocuments(databaseId, collectionId, [
//         Query.equal('followingId', targetUserId),
//       ]);
//       setFollowersCount(followersResponse.total + 1); // Increment the followers count

//     } catch (error) {
//       console.error('Error following user:', error);
//     }
//   };

//   // Function to unfollow a user
//   const unfollowUser = async (targetUserId: string): Promise<void> => {
//     if (!currentUserId) return;

//     try {
//       // Find the follow document to delete
//       const response = await databases.listDocuments(databaseId, collectionId, [
//         Query.equal('followerId', currentUserId),
//         Query.equal('followingId', targetUserId),
//       ]);

//       if (response.documents.length > 0) {
//         const followId = response.documents[0].$id;
//         await databases.deleteDocument(databaseId, collectionId, followId);

//         // Update followed users list and counts
//         setFollowedUsers((prev) => prev.filter((id) => id !== targetUserId));
//         setFollowingCount((prev) => prev - 1); // Decrement the following count

//         // Decrement followers count for the target user
//         const followersResponse = await databases.listDocuments(databaseId, collectionId, [
//           Query.equal('followingId', targetUserId),
//         ]);
//         setFollowersCount(followersResponse.total - 1); // Decrement the followers count
//       }
//     } catch (error) {
//       console.error('Error unfollowing user:', error);
//     }
//   };

//   return (
//     <FollowContext.Provider value={{ isFollowing, followUser, unfollowUser, followersCount, followingCount }}>
//       {children}
//     </FollowContext.Provider>
//   );
// };

// FollowContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { databases, account } from '@/lib/appwrite/config'; // Assuming AppwriteService.js is configured
import { ID, Query } from 'appwrite';

// Context type to define the structure of the context
interface FollowContextType {
  isFollowing: (targetUserId: string) => boolean;
  followUser: (targetUserId: string) => Promise<void>;
  unfollowUser: (targetUserId: string) => Promise<void>;
  followersCount: number;
  followingCount: number;
  currentUserId: string | null; // Add currentUserId to the context
}

interface FollowProviderProps {
  children: React.ReactNode;
}

// Create FollowContext with default values for safety
const FollowContext = createContext<FollowContextType>({
  isFollowing: () => false,
  followUser: async () => {},
  unfollowUser: async () => {},
  followersCount: 0,
  followingCount: 0,
  currentUserId: null, // Add default value for currentUserId
});

/**
 * Hook to use the FollowContext, ensuring it's within a provider.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useFollowContext = (): FollowContextType => {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error('useFollowContext must be used within a FollowProvider');
  }
  return context;
};

// FollowProvider component to manage following/unfollowing logic
export const FollowProvider = ({ children }: FollowProviderProps): JSX.Element => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);

  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID as string;
  const collectionId = import.meta.env.VITE_APPWRITE_FOLLOWERS_COLLECTION_ID as string;

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async (): Promise<void> => {
      try {
        const user = await account.get();
        if (isMounted) {
          setCurrentUserId(user.$id);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchFollowedUsers = async (): Promise<void> => {
      if (!currentUserId) return;

      try {
        const followingResponse = await databases.listDocuments(databaseId, collectionId, [
          Query.equal('followerId', currentUserId),
        ]);
        const followed = followingResponse.documents.map((doc) => doc.followingId);

        if (isMounted) {
          setFollowedUsers(followed);
          setFollowingCount(followingResponse.total);
        }

        const followersResponse = await databases.listDocuments(databaseId, collectionId, [
          Query.equal('followingId', currentUserId),
        ]);

        if (isMounted) {
          setFollowersCount(followersResponse.total);
        }
      } catch (error) {
        console.error('Error fetching followed and followers users:', error);
      }
    };

    fetchFollowedUsers();

    return () => {
      isMounted = false;
    };
  }, [currentUserId, databaseId, collectionId]);

  const isFollowing = (targetUserId: string): boolean => {
    return followedUsers.includes(targetUserId);
  };

  const followUser = async (targetUserId: string): Promise<void> => {
    if (!currentUserId) return;

    try {
      await databases.createDocument(databaseId, collectionId, ID.unique(), {
        followerId: currentUserId,
        followingId: targetUserId,
      });
      
      setFollowedUsers((prev) => [...prev, targetUserId]);
      setFollowingCount((prev) => prev + 1);

      const followersResponse = await databases.listDocuments(databaseId, collectionId, [
        Query.equal('followingId', targetUserId),
      ]);
      setFollowersCount(followersResponse.total + 1);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const unfollowUser = async (targetUserId: string): Promise<void> => {
    if (!currentUserId) return;

    try {
      const response = await databases.listDocuments(databaseId, collectionId, [
        Query.equal('followerId', currentUserId),
        Query.equal('followingId', targetUserId),
      ]);

      if (response.documents.length > 0) {
        const followId = response.documents[0].$id;
        await databases.deleteDocument(databaseId, collectionId, followId);

        setFollowedUsers((prev) => prev.filter((id) => id !== targetUserId));
        setFollowingCount((prev) => prev - 1);

        const followersResponse = await databases.listDocuments(databaseId, collectionId, [
          Query.equal('followingId', targetUserId),
        ]);
        setFollowersCount(followersResponse.total - 1);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return (
    <FollowContext.Provider value={{ isFollowing, followUser, unfollowUser, followersCount, followingCount, currentUserId }}>
      {children}
    </FollowContext.Provider>
  );
};

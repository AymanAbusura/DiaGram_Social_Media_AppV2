import { Route, Routes, Link, Outlet, useParams, useLocation } from "react-router-dom";
import { LikedPosts, SavedPosts } from "@/_root/pages";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import GridPostList from "@/components/shared/GridPostList";
import '@/other.css';
import FollowButton from "@/components/shared/FollowButton";
import { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite/config";
import { Query } from "appwrite";
import { useTheme } from '@/context/ThemeContext';

interface StatBlockProps {
  value: string | number;
  label: string;
  isDarkMode: boolean;
  href?: string;
}

const StatBlock = ({ value, label, isDarkMode, href }: StatBlockProps) => (
  <Link to={href || '#'} className="flex-center gap-2" style={{ textDecoration: 'none', color: 'inherit' }}>
    <div className="flex-center gap-2" style={{ cursor: href ? 'pointer' : 'default' }}>
      <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
      <p className={`small-medium lg:base-medium ${isDarkMode ? 'text-light-2' : 'text-black-1'}`}>{label}</p>
    </div>
  </Link>
);

const Profile = () => {
  const { id } = useParams(); // Get the profile user's ID from route params
  const { user } = useUserContext(); // Logged-in user
  const { pathname } = useLocation();
  const { isDarkMode } = useTheme();

  const { data: currentUser } = useGetUserById(id || ""); // Fetch user data for the profile

  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);

  // Variables related to Appwrite's Database and Collection IDs
  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID as string;
  const collectionId = import.meta.env.VITE_APPWRITE_FOLLOWERS_COLLECTION_ID as string;

  // Fetch followers and following counts
  const fetchFollowStats = async (): Promise<void> => {
    if (!id) return; // Ensure 'id' exists before making queries

    try {
      // Fetch followers count (users who follow the profile user)
      const followersResponse = await databases.listDocuments(databaseId, collectionId, [
        Query.equal('followingId', id), // 'id' is the user being followed
      ]);
      setFollowersCount(followersResponse.total); // Set the total number of followers

      // Fetch following count (users that the profile user follows)
      const followingResponse = await databases.listDocuments(databaseId, collectionId, [
        Query.equal('followerId', id), // 'id' is the user who is following others
      ]);
      setFollowingCount(followingResponse.total); // Set the total number of users the profile user follows
    } catch (error) {
      console.error('Error fetching follow stats:', error);
    }
  };

  useEffect(() => {
    fetchFollowStats(); // Trigger fetch operation on component mount

    // Polling mechanism to update follower and following counts every 5 seconds
    const intervalId = setInterval(fetchFollowStats, 5000);

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [id, databaseId, collectionId]); // Dependency array

  // If the user data is still being fetched
  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <div style={{ position: 'relative' }}>
            <img
              src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
            />
            <img src='/assets/icons/plus.svg' alt='add stories' width={24} height={24} className="plus" style={{ zIndex: 1 }} />
          </div>
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="flex gap-1 justify-center text-center xl:text-left xl:justify-start h3-bold md:h1-semibold w-full">
                {currentUser.name}
                {currentUser.label === 'Verified' && <img src="/assets/icons/verify.svg" alt="verify" width={20} height={20} />}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" isDarkMode={isDarkMode} />
              <StatBlock value={followersCount} label="Followers" isDarkMode={isDarkMode} href={`/follower-profile/${id}`} />
              <StatBlock value={followingCount} label="Following" isDarkMode={isDarkMode} href={`/following-profile/${id}`} />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {/* Show 'Edit Profile' and 'Settings' only for the logged-in user */}
            {user.id === currentUser.$id ? (
              <>
                <Link
                  to={`/update-profile/${currentUser.$id}`}
                  className={`h-12 px-5 flex-center gap-2 rounded-lg ${isDarkMode ? 'bg-dark-4 text-light-1' : 'bg-light-2 text-dark-1'}`}
                >
                  <img src={"/assets/icons/edit.svg"} alt="edit" width={20} height={20} />
                  <p className="flex whitespace-nowrap small-medium">Edit Profile</p>
                </Link>
                <Link
                  to={`/settings-profile/${currentUser.$id}`}
                  className={`h-12 px-5 flex-center gap-2 rounded-lg ${isDarkMode ? 'bg-dark-4 text-light-1' : 'bg-light-2 text-dark-1'}`}
                >
                  <img src={"/assets/icons/setting.svg"} alt="setting" width={20} height={20} />
                  <p className="flex whitespace-nowrap small-medium">Settings</p>
                </Link>
              </>
            ) : (
              <>
                {/* Show 'Follow' button and 'Message' for other users */}
                <FollowButton targetUserId={currentUser.$id} />
                <Button type="button" className="px-8" style={{ backgroundColor: 'white', color: 'black' }}>
                  Message
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            // className={`profile-tab rounded-l-lg ${pathname === `/profile/${id}` && "!bg-dark-3"}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` ? (isDarkMode ? '!bg-dark-3' : '!bg-light-1 border') : ''
            }`}
          >
            <img src={"/assets/icons/posts.svg"} alt="posts" width={20} height={20} />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab ${pathname === `/profile/${id}/liked-posts` ? (isDarkMode ? '!bg-dark-3' : '!bg-light-1 border') : ''}`}
          >
            <img src={"/assets/icons/like.svg"} alt="like" width={20} height={20} />
            Liked Posts
          </Link>
          <Link
            to={`/profile/${id}/saved-posts`}
            className={`profile-tab rounded-r-lg ${pathname === `/profile/${id}/saved-posts` ? (isDarkMode ? '!bg-dark-3' : '!bg-light-1 border') : ''}`}
          >
            <img src={"/assets/icons/save.svg"} alt="saved" width={20} height={20} />
            Saved Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route index element={<GridPostList posts={currentUser.posts} showUser={false} />} />
        {currentUser.$id === user.id && (
          <>
            <Route path="liked-posts" element={<LikedPosts />} />
            <Route path="saved-posts" element={<SavedPosts />} />
          </>
        )}
      </Routes>

      <Outlet />
    </div>
  );
};

export default Profile;
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import StoryList from "@/components/shared/StoryList";
import UserCard from "@/components/shared/UserCard";
import { useGetRecentPosts, useGetUsers, useGetCurrentUser } from "@/lib/react-query/queriesAndMutations"; // Adjust as needed to get current user
import { Models } from "appwrite";

const Home = () => {
  const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPosts();
  const { data: creators, isPending: isUserLoading, isError: isErrorCreators } = useGetUsers(10);
  const { data: currentUser } = useGetCurrentUser(); // Assuming a hook exists to fetch current user
  
  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <div className='max-w-screen-sm flex flex-row items-center w-full gap-6 md:gap-9 overflow-x-scroll' style={{scrollbarWidth:'none' }}>
            <StoryList />
          </div>
          <hr className="border w-full border-dark-4/80" />
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              { posts?.documents.map((post: Models.Document) => (
                <PostCard post={post} key={post.caption} />
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents
              .filter(creator => creator.$id !== currentUser?.$id)  // Exclude current user
              .map((creator) => (
                <li key={creator?.$id}>
                  <UserCard user={creator} />
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;
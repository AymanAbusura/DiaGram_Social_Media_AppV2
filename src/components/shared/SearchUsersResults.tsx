/* eslint-disable @typescript-eslint/no-explicit-any */
import Loader from './Loader';
import UserCard from './UserCard';

type SearchUsersResultsProps = {
  isSearchFetching: boolean;
  searchedUsers: any;
  currentUserId: string;
}

const SearchUsersResults = ({ isSearchFetching, searchedUsers, currentUserId }: SearchUsersResultsProps) => {
  if(isSearchFetching) { 
    return <Loader />
  }
  
  if (searchedUsers && searchedUsers.documents.length > 0) {
    return (
      <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
        {searchedUsers.documents.
        filter((user: any) => user.$id !== currentUserId)
        .map((user: any) => (
          <li key={user.$id} className='flex-1 min-w-[200px] w-full'>
            <UserCard user={user} />
          </li>
        ))}
      </div>
    );
  }

  return (
    <p className='text-light-4 mt-10 text-center w-full'>No results found</p>
  )
}

export default SearchUsersResults
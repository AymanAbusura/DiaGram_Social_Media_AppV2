/* eslint-disable @typescript-eslint/no-explicit-any */
import Loader from './Loader';
import UserCard from './UserCard';

type SearchUsersResultsProps = {
  isSearchFetching: boolean;
  searchedUsers: any;
}
const SearchUsersResults = ({ isSearchFetching, searchedUsers }: SearchUsersResultsProps) => {
  if(isSearchFetching) { 
    return <Loader />
  }
  
  if (searchedUsers && searchedUsers.documents.length > 0) {
    return (
      <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
        {searchedUsers.documents.map((user: any) => (
          <li className='flex-1 min-w-[200px] w-full'>
            <UserCard key={user.$id} user={user} />
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
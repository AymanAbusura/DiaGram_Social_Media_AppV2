import { Link } from 'react-router-dom';

import { useUserContext } from '@/context/AuthContext';
import { Models } from 'appwrite';
import PostStats from './PostStats';

import { useTheme } from '@/context/ThemeContext';

type GridPostListProps  = {
  posts?: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
}

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
  const { user } = useUserContext();
  const { isDarkMode } = useTheme();

  return (
    <ul className='grid-container'>
      {posts?.map((post) => (
        <li key={post.$id} className='relative min-w-78 h-80'>
          <Link to={`/posts/${post.$id}`} className='grid-post_link'>
            <img src={post.imageUrl} alt='post' className='h-full w-full object-contain' />
          </Link>
          <div className='grid-post_user'>
            {showUser && (
              <div className='flex items-center justify-start gap-2 flex-1'>
                <img src={post.creator.imageUrl} alt='creator' className='h-8 w-8 rounded-full' />
                <p className={`flex gap-1 line-clamp-1 ${isDarkMode ? 'text-black-1' : 'text-light-1'}`}>{post.creator.name} {post.creator.label === 'Verified' && <img src="/assets/icons/verify.svg" alt="verify" width={20} height={20} />}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id} /> }
          </div>
        </li>
      ))}
    </ul>
  )
}

export default GridPostList
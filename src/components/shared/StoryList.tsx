import React, { useState } from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

import '@/other.css';
import { StoryCard } from './StoryCard';
import usePreventBodyScroll from '@/hooks/usePreventBodyScroll';
import { useUserContext } from "@/context/AuthContext";

// Mock function for getting followers' stories
const getFollowersStories = () => {
  // This function should get followers' stories and their timestamps from an API or database
  return [
    { id: 'follower1', imageUrl: 'assets/icons/profile-placeholder.svg', story: { timestamp: Date.now() - 2 * 60 * 60 * 1000 } }, // Story posted 2 hours ago
    { id: 'follower2', imageUrl: 'assets/icons/profile-placeholder.svg', story: { timestamp: Date.now() - 25 * 60 * 60 * 1000 } }, // Expired story
    { id: 'follower3', imageUrl: 'assets/icons/profile-placeholder.svg', story: { timestamp: Date.now() - 5 * 60 * 60 * 1000 } }, // Story posted 5 hours ago
    // More followers...
  ];
};

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
  const isTouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isTouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
}

const StoryList = () => {
  const { user } = useUserContext(); // Get the current user
  const [followersStories] = useState(getFollowersStories); // Mocked followers' stories
  const { disableScroll, enableScroll } = usePreventBodyScroll();

  return (
    <div className='flex gap-1 w-1'>
      {/* Current User's Story */}
      <div onMouseEnter={disableScroll} onMouseLeave={enableScroll} style={{ position: 'relative' }}>
        <ScrollMenu onWheel={onWheel}>
          <img
            src='/assets/icons/plus.svg'
            alt='add stories'
            width={20}
            height={20}
            style={{
              position: 'absolute',
              zIndex: 1,
              bottom: '5%',
              right: '10%',
              backgroundColor: 'white',
              borderRadius: '50%',
              borderWidth: '2%',
            }}
          />
          {/* Current User's Story Card */}
          <StoryCard itemId={'currentUser'} user={user} />
        </ScrollMenu>
      </div>

      {/* Followers' Stories */}
      <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
        <ScrollMenu onWheel={onWheel}>
          {followersStories.map(({ id, imageUrl, story }) => (
            <StoryCard itemId={id} key={id} user={{ imageUrl }} story={story} />
          ))}
        </ScrollMenu>
      </div>
    </div>
  );
};

export default StoryList;
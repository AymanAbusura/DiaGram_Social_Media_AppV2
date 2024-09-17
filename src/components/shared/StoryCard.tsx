import React from "react";
import { useUserContext } from "@/context/AuthContext";
import { VisibilityContext } from "react-horizontal-scrolling-menu";

interface Story {
  imageUrl: string;
  timestamp: number; // Unix timestamp when the story was added
}

interface StoryCardProps {
  itemId: string;
  user?: { imageUrl: string }; // Optional for followers
  story?: Story; // Story data for followers
}

export function StoryCard({ itemId, user, story }: StoryCardProps) {
  const { user: currentUser } = useUserContext();
  const visibility = React.useContext(VisibilityContext);

  // Check if visibility context is available and has the method
  const visible = visibility?.isItemVisible ? visibility.isItemVisible(itemId) : true;

  // Calculate if story is expired (if it exists)
  const isStoryExpired = story ? Date.now() - story.timestamp > 24 * 60 * 60 * 1000 : false;

  // If it's a follower's story and it's expired, don't render it
  if (story && isStoryExpired) {
    return null;
  }

  const imageUrl = user?.imageUrl || currentUser.imageUrl || "/assets/icons/profile-placeholder.svg";

  return (
    <div
      role="button"
      tabIndex={0}
      className="card"
      style={{
        width: "80px",
        height: "80px",
        border: "1px solid",
        borderRadius: 80 / 2,
        borderWidth: 2,
        borderColor: "#7970ff",
        display: "inline-block",
        margin: "0 10px",
        userSelect: "none",
        opacity: visible ? 1 : 0.5, // Adjust visibility if needed
      }}
    >
      <img
        src={imageUrl}
        style={{
          width: "70px",
          height: "70px",
          border: "1px solid",
          borderRadius: 70 / 2,
          borderWidth: 2,
          borderColor: "#7970ff",
          display: "inline-block",
          margin: "3px",
          userSelect: "none",
        }}
        alt="User"
      />
    </div>
  );
}

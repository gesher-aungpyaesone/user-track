import React, { useState, useEffect, useRef } from 'react';

const Post = ({ title, body }) => {
  const [hasBeenSeen, setHasBeenSeen] = useState(false); // Track if the post has been seen
  const postRef = useRef(null); // Ref to reference the post element
  const timerRef = useRef(null); // Ref to store the timer ID
  const timerStartedRef = useRef(false); // Ref to track if the timer is already running
  const threshold = 300; // Set threshold value

  const handleScroll = () => {
    if (!postRef.current) return;

    // Get position of the post element relative to the viewport
    const rect = postRef.current.getBoundingClientRect();
    console.log(title, rect.top, rect.bottom);

    // Check if both the top and bottom are within the 100px threshold from the viewport edges
    const isTopInThreshold = rect.top <= threshold;
    const isBottomInThreshold = rect.bottom >= threshold;

    // Post will be considered "seen" only if both top and bottom are within the threshold
    if (isTopInThreshold && isBottomInThreshold && !timerStartedRef.current) {
      timerStartedRef.current = true;

      // Start a timeout of 3 seconds (3000 ms) to mark the post as seen
      timerRef.current = setTimeout(() => {
        setHasBeenSeen(true); // Mark as seen after 3 seconds
      }, 3000);
    }

    // If the post leaves the viewport, stop the timer and reset the "seen" state
    if (!(isTopInThreshold && isBottomInThreshold) && timerStartedRef.current) {
      clearTimeout(timerRef.current); // Clear the timer
      timerStartedRef.current = false; // Reset the timer flag
      // setHasBeenSeen(false); // Reset the seen state
    }
  };

  useEffect(() => {
    // Attach the scroll event listener to the window
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener and clear the timer on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timerRef.current) {
        clearTimeout(timerRef.current); // Clear the timer if the component is unmounted
      }
    };
  }, []);

  return (
    <div
      ref={postRef}
      className='post'
      style={{
        border: '1px solid #ddd',
        padding: '20px',
        margin: '10px 0',
        backgroundColor: hasBeenSeen ? '#e0ffe0' : '#fff', // Change color if seen
      }}
    >
      <h3>{title}</h3>
      <p>{body}</p>
      <p>
        {hasBeenSeen
          ? 'You have seen this post.'
          : 'This post is yet to be seen.'}
      </p>
    </div>
  );
};

export default Post;

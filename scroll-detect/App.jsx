import React, { useState, useEffect, useCallback } from 'react';
import Post from './Post';

export function App(props) {
  const [posts, setPosts] = useState([]); // To store posts
  const [loading, setLoading] = useState(false); // To track if data is loading
  const [page, setPage] = useState(1); // To keep track of the current page
  const threshold = 300; // Threshold for visibility

  // Fetch data from API (memoized with useCallback to avoid unnecessary re-renders)
  const fetchPosts = useCallback(async () => {
    if (loading) return; // Prevent fetching while already loading
    setLoading(true);

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=3`
      );
      const newPosts = await response.json();
      setPosts(prevPosts => [...prevPosts, ...newPosts]); // Append new posts to the existing list
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, page]); // The effect should depend on page and loading state

  useEffect(() => {
    fetchPosts(); // Trigger fetch when page changes
  }, [page]); // Only include page in dependency to fetch new posts when page changes

  // Handle infinite scrolling when reaching the bottom of the page
  const handleScroll = () => {
    const bottom =
      document.documentElement.scrollHeight ===
      document.documentElement.scrollTop + window.innerHeight;
    if (bottom && !loading) {
      setPage(prevPage => prevPage + 1); // Increment the page number to load more posts
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll); // Add scroll event listener
    return () => {
      window.removeEventListener('scroll', handleScroll); // Clean up event listener on unmount
    };
  }, [loading]); // Only re-attach the scroll listener when loading state changes

  return (
    <div className='App'>
      <h1>React Infinite Scroll Posts Example</h1>
      <div
        style={{
          position: 'fixed',
          top: threshold + 'px',
          left: 0,
          width: '100%',
          borderTop: '2px dashed red', // Threshold line style
          zIndex: 9999,
        }}
      >
        <p style={{ textAlign: 'center', color: 'red' }}>Threshold Line</p>
      </div>
      {posts.map((post, index) => (
        <Post
          key={`${post.id}-${page}-${index}`}
          title={post.title}
          body={post.body}
        />
      ))}
      {loading && <p>Loading more posts...</p>}
    </div>
  );
}

// Log to console
console.log('Hello console');

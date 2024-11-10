/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { PostCard } from "../Components";
import { useSelector } from "react-redux";
import { getAllPostsByUser } from "../AppWrite/Apibase";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userStatus = useSelector((state) => state.Auth.status);
  const authToken = localStorage.getItem("authToken");

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPostsByUser(authToken);
      
      if (response) {
        setPosts(response);
      } else {
        setPosts([]);
      }
    } catch (error) {
      setError("Error fetching posts.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    
  };

  useEffect(() => {
    if (authToken) {
      getPosts();
    } else {
      setError("User not authenticated.");
    }
  }, [authToken]);

  if (error) {
    return (
      <div className="w-full h-full py-8 mt-4 text-center bg-black">
        <h1 className="text-2xl font-bold text-white">{error}</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full py-8 mt-4 text-center bg-black">
        <h1 className="text-2xl font-bold text-white">Loading posts...</h1>
      </div>
    );
  }

  if (posts.length === 0 && userStatus === true) {
    return (
      <div className="w-full h-full py-8 mt-4 text-center bg-black">
        <div className="flex flex-wrap h-full bg-black">
          <div className="p-2 w-full">
            <h1 className="text-2xl font-bold text-white">No Posts Available</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full mt-10">
      <div className="flex h-full bg-black flex-wrap justify-center sm:justify-start">
        {posts.map((post) => (
          <div key={post._id} className="p-2 w-full sm:w-auto">
            <PostCard $id={post._id} title={post.title} image={post.image} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllPosts;

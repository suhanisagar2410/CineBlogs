/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { PostCard } from "../Components";
import { useSelector } from "react-redux";
import { getAllPostsByUser } from "../AppWrite/Apibase";
import { useNavigate } from "react-router-dom";
function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
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


  if (posts.length === 0) {
    return (
      <div className="w-full h-full py-8 mt-4 flex justify-center items-center bg-black from-gray-800 to-black text-center">
        <div className="max-w-lg">
          <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-4">
            No Posts Yet
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Start sharing your thoughts with the world! Click the <span onClick={()=> navigate('/add-post')} className="text-indigo-400 cursor-pointer">Add Post</span> button to get started.
          </p>
          <p className="text-sm text-gray-500">
            Whether it's your first blog or a new idea, we're excited to see what you create.
          </p>
        </div>
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
      <div className="ml-10 flex h-full bg-black flex-wrap justify-center sm:justify-start">
        {posts.map((post) => (
          <div key={post._id} className="p-5 w-full sm:w-auto">
            <PostCard $id={post._id} title={post.title} image={post.image} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllPosts;

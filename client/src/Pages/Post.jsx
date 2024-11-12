import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "../Components";
import { useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";
import { deletePost, getPostById } from "../AppWrite/Apibase";
import { toast } from "react-toastify";

export default function Post() {
  const [post, setPost] = useState(null);
  const [isAuthor, setAuthor] = useState(false);

  const { postId } = useParams();
  const userStatus = useSelector((state) => state.Auth.status);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.Auth.userData);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (postId) {
      getPostById(postId)
        .then((fetchedPost) => {
          setPost(fetchedPost);
          if (userData) {
            checkIsAuthor(fetchedPost);
          }
        })
        .catch(() => {
          toast.error("Post not found");
          navigate("/");
        });
    }
  }, [postId, navigate, userData]);
  const checkIsAuthor = (fetchedPost) => {
    if (userData && fetchedPost.userId._id === userData._id) {
      setAuthor(true);
    }
  };

  console.log(post?.userId.username, '////')

  const deletePostFunc = async () => {
    setLoading(true);
    await deletePost(post._id)
      .then(() => {
        toast.success("Post deleted successfully!");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message || "An error occurred while deleting the post.");
      })
      .finally(() => setLoading(false));
  };

  if (!post) return null;

  if (isLoading) {
    return (
      <div className="w-full flex flex-col justify-center items-center bg-gradient-to-b from-black via-purple-950 to-black py-12">
        <div className="p-4 w-full flex flex-col justify-center items-center">
          <h1 className="text-4xl font-semibold text-white">
            "Patience, the Best Stories Are Worth the Wait."
          </h1>
          <p className="text-lg mt-2 text-gray-300">
            We’re brewing something great! Check back soon for fresh content.
          </p>
        </div>
        <div className='mt-[5rem]'>
          <ScaleLoader color="#ffffff" height={50} />
        </div>
      </div>
    );
  }

  if (userStatus !== true) {
    return (
      <div className="w-full py-12 mt-4 text-center">
        <div className="flex flex-wrap justify-center">
          <div className="p-4 w-full">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              "Unlock a World of Stories, One Post at a Time."
            </h1>
            <p className="text-lg mt-2 text-gray-300">
              Sign in and start exploring. Dive into the world of endless content!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return post ? (
    <div className={`bg-gradient-to-b from-black via-purple-900 to-black min-h-screen flex flex-col items-center relative ${isAuthor ? 'py-10' : 'py-0'}`}>
      {isAuthor && (
        <div className="absolute top-8 right-8 sm:right-10 flex gap-4">
          <Link to={`/edit-post/${post._id}`}>
            <Button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-lg hover:bg-purple-700 hover:scale-105 transform transition-all duration-300">
              Edit
            </Button>
          </Link>
          <Button
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full shadow-lg hover:bg-red-700 hover:scale-105 transform transition-all duration-300"
            onClick={deletePostFunc}
          >
            Delete
          </Button>
        </div>
      )}

      <div className="w-full max-w-[80rem] flex flex-col sm:flex-col items-center gap-8 text-white mt-16 sm:mt-0">
        <div className="sm:flex justify-center items-center">
        <div className="sm:w-full w-full h-full sm:h-[17rem] sm:rounded-xl flex justify-center items-center relative">
          <img
            src={post?.image}
            alt={post?.title}
            className="sm:w-full w-[17rem] mb-5 sm:mb-0 h-full object-contain rounded-xl transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="flex flex-col w-full sm:ml-5 items-center sm:items-start text-gray-300 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Written by
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 transform transition-all duration-300">
            {post?.userId.username || "Unknown Author"}
          </h3>
          <p className="text-sm sm:text-base text-gray-400 mt-2 sm:mt-3 tracking-wide">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        </div>
        <div className="sm:w-[60%] w-full text-white">
          <h1 className="text-2xl font-extrabold text-center left text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 leading-tight mt-6 transform hover:scale-105 transition-all duration-300 ease-in-out">
            {post.title}
          </h1>

          <p className="text-lg text-gray-300 text-center sm:text-left px-6 sm:px-12 max-w-[60rem] mt-4">
            {post.content}
          </p>
        </div>
      </div>
    </div>
  ) : null;

}

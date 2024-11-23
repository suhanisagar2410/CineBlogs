import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";
import { addLike, deletePost, getPostById } from "../AppWrite/Apibase.js";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // Import the FontAwesomeIcon component
import { faL, faThumbsDown } from '@fortawesome/free-solid-svg-icons'; // Import the icon you want to use
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

export default function Post() {
  const [post, setPost] = useState(null);
  const [isAuthor, setAuthor] = useState(false);
  const token = localStorage.getItem('authToken')
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const { postId } = useParams();
  const userStatus = useSelector((state) => state.Auth.status);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.Auth.userData);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    if (postId) {
      getPostById(postId)
        .then((fetchedPost) => {
          setPost(fetchedPost);
          setLikes(fetchedPost.likes.length || 0);
          setDislikes(fetchedPost.dislikes || 0);
          if (userData) {
            checkIsAuthor(fetchedPost);
          }
        })
        .catch(() => {
          toast.error("Post not found");
          navigate("/");
        })  
        .finally(() => setLoading(false));
    }
  }, [postId, userData, userHasLiked]);

  const checkIsAuthor = (fetchedPost) => {
    if (userData && fetchedPost.userId._id === userData._id) {
      setAuthor(true);
    }
  };

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
  const handleLike = async () => {
    setLoading(true)
      const response = await addLike( post._id, token)
      setUserHasLiked((prev)=> !prev)
      setLoading(false)
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col justify-center items-center bg-gradient-to-b from-black via-[#14061F] to-black py-12">
        <div className="p-4 w-full flex flex-col justify-center items-center">
          <h1 className="text-4xl font-semibold text-white">
            "Patience, the Best Stories Are Worth the Wait."
          </h1>
          <p className="text-lg mt-2 text-gray-300">
            We’re brewing something great! Check back soon for fresh content.
          </p>
        </div>
        <div className="mt-[5rem]">
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

  console.log(post)

  return post ? (
    <div
      className={`bg-gradient-to-b from-black via-[#0d0216] to-black min-h-screen flex-col relative ${isAuthor ? "py-10" : "py-0"
        }`}
    >
      {isAuthor && (
        <div className="absolute top-8 right-8 sm:right-10 flex gap-4">
          <Link to={`/edit-post/${post._id}`}>
            <button className="px-4 py-2 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300">
              Edit
            </button>
          </Link>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-300"
            onClick={deletePostFunc}
          >
            Delete
          </button>
        </div>
      )}

      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-full max-w-[80rem] sm:flex gap-12 text-white mt-16 sm:mt-8 px-4">

          <div className="sm:w-1/3 mt-5 h-[20rem] flex justify-start items-start sm:items-center">

            <div className="w-full flex justify-center sm:justify-start items-center -auto rounded-xl overflow-hidden mb-8 sm:mb-0">
              <img
                src={post?.image}
                alt={post?.title}
                className="h-[21rem] object-cover rounded-xl transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Post Content */}
          <div className="w-full flex-col justify-center items-center max-w-[60rem] mt-7 text-white text-center">
            <div className="flex justify-between items-center">
              {!isAuthor && (
                <div className="sm:ml-[12rem] w-full relative flex flex-col items-center sm:items-center text-gray-300">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                    Written by
                  </h2>
                  <Link to={`/profile/${post?.userId._id}`}>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 transform transition-all duration-300">
                      {post?.userId.username || "Unknown Author"}
                    </h3>
                  </Link>
                  <p className="text-sm sm:text-base text-gray-400 mt-2 tracking-wide">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              {!isAuthor && (
                <div className="sm:flex hidden sm:mr-[3rem] relative gap-6 mb-8 justify-center">
                  <button
                    className={`flex justify-center items-center px-3 py-2 text-[1.2rem] font-bold transition-all transform ${userHasLiked ? "scale-110" : "hover:scale-105"}`}
                    onClick={handleLike}
                    style={{
                      borderRadius: "15px",
                      background: "linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                      border: "1px solid rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(10px)",
                      color: "white", // Green color for the icon and text
                    }}
                  >
                    <FontAwesomeIcon icon={faThumbsUp} style={{ marginRight: '8px' }} />
                    {post?.likes?.length}
                  </button>
{/* 
                  <button
                    className={`flex justify-center items-center px-3 py-2 text-[1.2rem] font-bold transition-all transform ${userHasDisliked ? "scale-110" : "hover:scale-105"}`}
                    onClick={handleDislike}
                    style={{
                      borderRadius: "15px",
                      background: "linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                      border: "1px solid rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(10px)",
                      color: "white", // Ensures icon and text are white
                    }}
                  >
                    <FontAwesomeIcon icon={faThumbsDown} style={{ marginRight: '8px' }} />
                    {dislikes}
                  </button> */}
                </div>
              )}
            </div>

            <p className="text-lg text-gray-300 mt-7 px-6">
              {post.content}
            </p>
          </div>
        </div>

        {/* Like/Dislike Buttons */}
        <div className="flex relative sm:hidden gap-6 mt-8 justify-center">
          <button
            className={`relative px-3 py-3 text-xl font-bold transition-all transform ${userHasLiked ? "scale-110" : "hover:scale-105"}`}
            onClick={handleLike}
            style={{
              borderRadius: "20px",
              background: "linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              color: "white", // Green color for the icon and text
            }}
          >
            <FontAwesomeIcon icon={faThumbsUp} style={{ marginRight: '8px' }} />
            {likes}
          </button>

          {/* <button
            className={`relative px-3 py-3 text-xl font-bold transition-all transform ${userHasDisliked ? "scale-110" : "hover:scale-105"}`}
            onClick={handleDislike}
            style={{
              borderRadius: "20px",
              background: "linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              color: "white", // Ensures icon and text are white
            }}
          >
            <FontAwesomeIcon icon={faThumbsDown} style={{ marginRight: '8px' }} />
            {dislikes}
          </button> */}
        </div>
      </div>
    </div>
  ) : null;
}

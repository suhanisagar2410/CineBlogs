import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "../Components";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [isAuthor, setAuthor] = useState(false);
  const { postId } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.Auth.userData);
  const authToken = localStorage.getItem("authToken")
  const getPost = async () => {
    if (postId) {
      await axios
        .get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/v1/posts/get-post/${postId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((data) => setPost(data.data.data))
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  const userStatus = useSelector((state) => state.Auth.status);

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
    <div className="py-10 bg-gradient-to-b from-black via-purple-900 to-black min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[80rem] flex flex-col sm:flex-row items-center gap-8 text-white">

        {/* Image Container with Sticky Position */}
        <div className="sm:w-[15rem] w-full h-full sm:h-[15rem] rounded-lg overflow-hidden shadow-md flex justify-center items-center relative">
          <img
            src={post?.image}
            alt={post?.title}
            className="w-full h-full object-contain rounded-xl transition-transform duration-300 hover:scale-105"
          />
        </div>



        {/* Post Content */}
        <div className="sm:w-[60%] w-full text-white">
          <h1 className="text-2xl font-extrabold text-center sm:text-left text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 leading-tight mt-6 transform hover:scale-105 transition-all duration-300 ease-in-out">
            {post.title}:-
          </h1>


          <p className="text-lg text-gray-300 text-center sm:text-left px-6 sm:px-12 max-w-[60rem] mt-4">
            {post.content}
          </p>
        </div>
      </div>

      {isAuthor && (
        <div className="absolute bottom-6 right-6 flex gap-2">
          <Link to={`/edit-post/${post.$id}`}>
            <Button className="px-4 py-2 bg-white text-black rounded-md shadow-sm hover:bg-gray-200 transition">
              Edit
            </Button>
          </Link>
          <Button
            className="px-4 py-2 bg-white text-black rounded-md shadow-sm hover:bg-gray-200 transition"
            onClick={deletePost}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  ) : null;
}

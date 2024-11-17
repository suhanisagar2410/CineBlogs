import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ScaleLoader } from "react-spinners";
import { createFollow } from '../AppWrite/Apibase';
import { toast } from 'react-toastify';

export default function UserProfile() {
  const [userData, setUser] = useState(null);
  const { userId } = useParams();
  const authToken = localStorage.getItem('authToken');
  const [isLoading, setLoading] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const appUser = useSelector((state) => state.Auth.userData);
  const [isFollowing, setIsFollowing] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const getUser = async () => {
    if (!appUser) return;
    if(!isLoading) setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/v1/users/get-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const user = response.data.data;
      setUser(user);
      setIsFollowing(
        user?.followers?.some((follow) => follow.follower._id === appUser?._id) || false
      );
      setIsAuthor(user?._id === appUser?._id);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  console.log(userData)
  const handleFollow = async () => {
    try {
      setIsClicked(true)
      setLoading(true)
        const response = await createFollow(userId, authToken);
        setIsFollowing((prev)=> !prev)
        toast.success(response.message, {
          autoClose: 1000,
          style: {
            backgroundColor: "#2e1065",
            color: "#ffffff",
          },
          hideProgressBar: true,
        });
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  };
  useEffect(() => {
    if (appUser) {
      getUser();
    }
  }, [userId, appUser, isFollowing, isClicked]);

  console.log(isFollowing)

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

  return (
    <div className="bg-gradient-to-b from-black via-[#14061F] to-black min-h-screen flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-[40rem] bg-gradient-to-b from-purple-800 to-indigo-900 rounded-xl shadow-lg p-8 text-white text-center">
        <img
          src={userData?.profileImage || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto border-4 border-indigo-500 object-cover mb-6 transition-transform duration-300 hover:scale-105"
        />
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-800 mb-2">
          {userData?.username || "Anonymous"}
        </h1>
        <p className="text-lg text-gray-300 mb-4">
          <strong>Email:</strong> {userData?.email}
        </p>
        <div className="flex justify-around mt-6 text-gray-300">
          <div>
            <p className="text-xl font-bold">{userData?.followers?.length || 0}</p>
            <p className="text-sm">Followers</p>
          </div>
          <div>
            <p className="text-xl font-bold">{userData?.totalPosts || 0}</p>
            <p className="text-sm">Posts</p>
          </div>
        </div>
        {
          !isAuthor && (
            <button
            onClick={handleFollow}
              className={`mt-8 px-6 py-2 rounded-full shadow-md transform transition-all duration-300"
                  : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:bg-indigo-700 hover:scale-105 text-white"
                }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )
        }
      </div>
    </div> 
  );
}

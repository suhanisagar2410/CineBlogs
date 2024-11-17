import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MyFollowers = ({ followers }) => {
    const [user, setUser] = useState(null)
    const { userId } = useParams();
    const authToken = localStorage.getItem('authToken');
    const [isLoading, setLoading] = useState(false);
    const getUser = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/v1/users/get-user/${userId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          console.log(response)
          const user = response.data.data;
          setUser(user);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };

      useEffect(() => {
          getUser();
      }, [userId]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 via-purple-900 to-black text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8">My Followers</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {user?.followers.map((follower, index) => (
          <div
            key={index}
            className="bg-purple-700 bg-opacity-50 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 p-5 flex flex-col items-center"
          >
            <div
              className="w-20 h-20 rounded-full bg-cover bg-center border-4 border-purple-400 mb-4"
              style={{
                backgroundImage: `url(${follower?.follower.profileImage || 'https://via.placeholder.com/150'})`,
              }}
            ></div>
            <h2 className="text-xl font-semibold">{follower?.follower?.username}</h2>
            <p className="text-sm text-gray-300">{follower?.follower?.email || "No bio available"}</p>
            <Link to>
            <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow transition">
              View Profile
            </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFollowers;

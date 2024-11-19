import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
        <div className="w-full min-h-screen flex flex-col justify-start items-center bg-gradient-to-b from-black via-[#14061F] to-black py-16 px-8">
      
          {/* No Followers message */}
          {user?.followers?.length === 0 ? (
            <p className="text-xl text-white text-center mb-10">
              You have no followers yet. Start following people to build your network!
            </p>
          ) : (
            <div className="w-full max-w-screen-xl grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {user?.followers.map((follower, index) => (
                <div
                  key={index}
                  className="relative bg-white p-4 rounded-xl shadow-md hover:shadow-2xl transition-transform transform hover:scale-105"
                >
                  {/* Profile Image */}
                  <div
                    className="w-24 h-24 rounded-full bg-cover bg-center mx-auto border-4 border-transparent mb-6"
                    style={{
                      backgroundImage: `url(${follower?.follower.profileImage || 'https://via.placeholder.com/150'})`,
                    }}
                  ></div>
      
                  {/* User Information */}
                  <h3 className="text-xl font-semibold text-black text-center mb-2">
                    {follower?.follower?.username}
                  </h3>
                  <p className="text-sm text-gray-600 text-center mb-4">
                    {follower?.follower?.email || "No bio available"}
                  </p>
      
                  {/* View Profile Button */}
                  <Link to={`/profile/${follower?.follower._id}`}>
                    <button className="w-full py-2 px-4 bg-purple-600 text-white hover:bg-purple-700 rounded-md shadow-md transition-all duration-200 ease-in-out transform hover:scale-105">
                      View Profile
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      );    
};

export default MyFollowers;

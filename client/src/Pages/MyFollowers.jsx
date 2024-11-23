import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
 
const MyFollowers = () => {
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
            <div className='mt-[5rem]'>
              <ScaleLoader color="#ffffff" height={50} />
            </div>
          </div>
        );
      }

      if (!isLoading) return (
        <div className="w-full min-h-screen flex flex-col justify-start bg-gradient-to-b from-black via-[#0d0216] to-black py-16 px-">
      
          {/* No Followers message */}
          {user?.followers?.length === 0 ? (
            <p className="text-xl text-white text-center mb-10">
              You have no followers yet. Start following people to build your network!
            </p>
          ) : (
            <div className="sm:ml-[4rem] w-full max-w-screen-xl grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {user?.followers.map((follower, index) => (
                <div
                key={index}
                className="relative mx-4 sm:mx-0 bg-transparent border-[1px] border-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={follower?.follower?.profileImage || "https://via.placeholder.com/100"}
                    alt={`${follower?.follower?.username}'s Profile`}
                    className="w-20 h-20 rounded-full border-2 border-white object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-white">
                    {follower?.follower?.username || "Unknown User"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {follower?.follower?.email || "No email found"}
                  </p>
                </div>
                <div className="mt-4">
                  <Link to={`/profile/${follower?.follower._id}`}>
                    <button className="w-full py-2 text-sm bg-white text-black rounded-lg shadow hover:bg-[#301445] transform hover:scale-[1.02] transition">
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>
              
              ))}
            </div>
          )}
        </div>
      );    
};

export default MyFollowers;

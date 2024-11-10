import React from "react";
import { Link } from "react-router-dom";

function PostCard({ _id, title, image }) {
  return (
    <Link
      to={`/post/${_id}`}
      className="block w-full transition-transform duration-200 hover:scale-[1.02]"
    >
      <div className="sm:w-[15rem] w-[18rem] h-[20rem] bg-gray-800 border border-gray-700 text-white rounded-lg shadow-md hover:shadow-lg transform transition-shadow duration-200 ease-in-out overflow-hidden">
        
        {/* Image container with hover overlay */}
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          
          {/* Title appears on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <h2 className="text-md font-medium text-white">{title}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;

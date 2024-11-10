/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";

function PostCard({ $id, title, image }) {
  
  return (
<Link to={`/post/${$id}`} className="block w-full transition-transform duration-300 hover:scale-110">

    <div className="sm:w-[15rem] w-[18rem] h-[20rem] bg-black sm:p-2 p-2 border-white border-2 text-white flex-wrap flex justify-center items-center rounded-md sm:rounded-[10px] mr-3">
        <div className="">
            <img
                src={image}
                alt={title}
                className="rounded w-[18rem] h-[19rem]"
            />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
    </div>
</Link>
  );
}

export default PostCard;

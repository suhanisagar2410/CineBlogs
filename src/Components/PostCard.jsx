import React from "react";
import postServices from "../AppWrite/CreatePost";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`} className="block w-full">
    <div className="w-full sm:w-[25rem] bg-white rounded p-2">
        <div className="mb-4">
            <img
                src={postServices.getImage(featuredImage)}
                alt={title}
                className="rounded w-full"
            />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
    </div>
</Link>

  );
}

export default PostCard;

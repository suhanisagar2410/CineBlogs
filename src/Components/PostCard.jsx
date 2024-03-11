import React from "react";
import postServices from "../AppWrite/CreatePost";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-[25rem] bg-white rounded p-2">
        <div className=" justify-center mb-4">
          <img
            src={postServices.getImage(featuredImage)}
            alt={title}
            className="rounded"
          />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;

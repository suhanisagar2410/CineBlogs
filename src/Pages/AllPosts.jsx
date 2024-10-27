import React, { useEffect, useState } from "react";
import postServices from "../AppWrite/CreatePost";
import { PostCard } from "../Components";
import { useSelector } from 'react-redux'

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const userStatus = useSelector((state) => state.Auth.status)

  useEffect(() => {
    postServices.getPosts([]).then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });
  }, []);

  if(posts.length === 0 && userStatus == true){
    return   <div className="w-full h-full py-8 mt-4 text-center bg-black">
    <>
        <div className="flex flex-wrap h-full bg-black">
            <div className="p-2 w-full">
                <h1 className="text-2xl font-bold text-white">
                    No Posts Available
                </h1>
            </div>
        </div>
    </>
</div>
}

  return (
<div className="w-full h-full mt-10">
    <>
        <div className="flex h-full bg-black flex-wrap justify-center sm:justify-start">
            {posts.map((post) => (
                <div key={post.$id} className="p-2 w-full sm:w-auto">
                    <PostCard {...post} />
                </div>
            ))}
        </div>
    </>
</div>

  );
}

export default AllPosts;

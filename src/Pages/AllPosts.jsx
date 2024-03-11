import React, { useEffect, useState } from "react";
import postServices from "../AppWrite/CreatePost";
import { PostCard } from "../Components";

function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    postServices.getPosts([]).then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });
  }, []);

  return (
    <div className="w-full h-full mt-10">
      <>
        <div className="flex flex-wrap justify-center items-center  sm:justify-start ">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 ">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </>
    </div>
  );
}

export default AllPosts;

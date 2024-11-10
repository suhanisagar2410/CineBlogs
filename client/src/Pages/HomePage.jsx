/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PostCard } from "../Components";
import { ScaleLoader } from "react-spinners";
import { getPosts } from "../AppWrite/Apibase";

function HomePage() {
  const [posts, setPosts] = useState([]);
  
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userStatus = useSelector((state) => state.Auth.status);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { posts } = await getPosts(1, 10);

        setPosts(posts);
      } catch (error) {
        setError("Error fetching posts");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <div className="flex items-center justify-center">
          <div className="mt-[10rem]">
            <ScaleLoader color="#ffffff" height={50} />
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0 && userStatus !== true) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <div className="flex flex-wrap">
          <div className="p-2 w-full">
            <h1 className="text-2xl font-bold text-white">
              Login to read posts
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0 && userStatus === true) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <div className="flex flex-wrap">
          <div className="p-2 w-full">
            <h1 className="text-2xl font-bold text-white">
              No Posts Available
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black py-8">
      <div className="ml-2 h-full flex flex-wrap sm:justify-start justify-center items-center">
        {posts.map((post) => (
          <div key={post._id} className="p-2">
            <PostCard $id={post._id} title={post.title} image={post.image} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;

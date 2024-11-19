import { useEffect, useState } from "react";
import { PostCard } from "../Components";
import { useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";
import { getAllPostsInHomePage } from "../AppWrite/Apibase";
import SearchBar from "../utility/SearchBar";

function HomePage() {
  const [posts, setPosts] = useState([]); 
  const [isLoading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0); 
  const [timer, setTimer] = useState(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    
    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      setCurrentPage(1);
      setPosts([]);
      fetchPosts(1, e.target.value); 
    }, 3000); 

    setTimer(newTimer);
  };

  const fetchPosts = async (page = 1, search = "") => {
    setLoading(true);
    const authToken = localStorage.getItem("authToken");
    try {
      const { posts, postCount } = await getAllPostsInHomePage(authToken, search, page);
      setPosts((prevPosts) => [...prevPosts, ...posts]);
      setTotalPosts(postCount);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage, searchQuery);
  }, []); 

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage); 
    fetchPosts(nextPage, searchQuery); 
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    setPosts([]);
    fetchPosts(1);
  };

  const userStatus = useSelector((state) => state.Auth.status);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col justify-center items-center bg-gradient-to-b from-black via-purple-950 to-black py-12">
        <div className="p-4 w-full flex flex-col justify-center items-center">
          <h1 className="text-4xl font-semibold text-white">
            "Patience, the Best Stories Are Worth the Wait."
          </h1>
          <p className="text-lg mt-2 text-gray-300">
            We’re brewing something great! Check back soon for fresh content.
          </p>
        </div>
        <div className="mt-[5rem]">
          <ScaleLoader color="#ffffff" height={50} />
        </div>
      </div>
    );
  }

  if (posts.length === 0 && userStatus !== true) {
    return (
      <div className="w-full py-12 mt-4 text-center">
        <div className="flex flex-wrap justify-center">
          <div className="p-4 w-full">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              "Unlock a World of Stories, One Post at a Time."
            </h1>
            <p className="text-lg mt-2 text-gray-300">
              We’re brewing something great! Check back soon for fresh content.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-b from-black via-[#14061F] to-black py-12">
      <div className="w-full flex justify-center items-center mb-8">
        <SearchBar
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
        />
      </div>
      <div className="text-center mb-8">
        <h2 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
          "Discover the Unseen, Explore the Unknown."
        </h2>
        <p className="text-xl text-gray-300 mt-4">
          From the latest movie reviews to insightful blogs, uncover content
          you’ve never seen before.
        </p>
      </div>
      <div className="sm:ml-5 w-full h-full flex flex-wrap sm:justify-center sm:items-center justify-center items-center gap-3 transition-all duration-500">
        {posts?.map((post) => (
          <div
            key={post._id}
            className="p-4 w-full sm:w-[18rem] lg:w-[20rem] xl:w-[22rem] transition-transform transform hover:scale-105 animate__animated animate__fadeIn animate__delay-1s"
          >
            <PostCard {...post} />
          </div>
        ))}
      </div>
      {posts.length < totalPosts && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
             className="load-more-btn"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;

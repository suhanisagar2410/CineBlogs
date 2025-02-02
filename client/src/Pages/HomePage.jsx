import { useEffect, useState } from "react";
import { PostCard } from "../Components";
import { useSelector } from "react-redux";
import { getAllPostsInHomePage } from "../AppWrite/Apibase";
import SearchBar from "../utility/SearchBar";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state for button

  const postsPerPage = 8; // Number of posts per request

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
    setPosts([]);
    fetchPosts(1, query);
  };

  const fetchPosts = async (page = 1, search = "") => {
    const authToken = localStorage.getItem("authToken");
    setLoading(true);
    try {
      const { posts: newPosts, postCount } = await getAllPostsInHomePage(authToken, search, page, postsPerPage);
      setPosts((prevPosts) => (page === 1 ? newPosts : [...prevPosts, ...newPosts]));
      setTotalPosts(postCount);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(currentPage, searchQuery);
  }, []); // Initial fetch

  const loadMorePosts = () => {
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

      {/* Load More Button & Loader */}
      {posts.length < totalPosts && (
        <div className="w-full flex justify-center mt-6">
          {loading ? (
            <div className="text-white text-lg">Loading...</div>
          ) : (
            <button
              onClick={loadMorePosts}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;

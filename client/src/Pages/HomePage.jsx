import { useEffect, useState, useRef } from "react";
import { PostCard } from "../Components";
import { useSelector } from "react-redux";
import { getAllPostsInHomePage } from "../AppWrite/Apibase";
import SearchBar from "../utility/SearchBar";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const observerRef = useRef(null); // Sentinel for infinite scroll

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
    setPosts([]);
    fetchPosts(1, query);
  };

  const fetchPosts = async (page = 1, search = "") => {
    const authToken = localStorage.getItem("authToken");
    try {
      const { posts: newPosts, postCount } = await getAllPostsInHomePage(authToken, search, page);
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setTotalPosts(postCount);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage, searchQuery);
  }, []); // Initial fetch

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && posts.length < totalPosts) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          fetchPosts(nextPage, searchQuery);
        }
      },
      { threshold: 1.0 } // Trigger when the sentinel is fully visible
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [currentPage, searchQuery, posts, totalPosts]); // Dependencies

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
      {/* Sentinel div for infinite scroll */}
      <div ref={observerRef} className="w-full h-16" />
    </div>
  );
}

export default HomePage;

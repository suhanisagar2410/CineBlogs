import { useEffect, useState } from 'react';
import { PostCard } from '../Components';
import { useSelector } from 'react-redux';
import { ScaleLoader } from "react-spinners";
import { getAllPosts } from '../AppWrite/Apibase';

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const getPosts = async () => {
        const authToken = localStorage.getItem("authToken");
        const posts = await getAllPosts(authToken);
        if (posts) {
            setPosts(posts);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            await getPosts();
            setLoading(false);
        };
        fetchPosts();
    }, []);

    const userStatus = useSelector((state) => state.Auth.status);

    if (isLoading && posts.length === 0 && userStatus === true) {
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
                <div className='mt-[5rem]'>
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

    if (posts.length === 0 && userStatus === true && !isLoading) {
        return (
            <div className="w-full py-12 mt-4 text-center">
                <div className="flex items-center justify-center">
                    <div className="mt-[10rem]">
                        <ScaleLoader color="#ffffff" height={50} />
                    </div>
                </div>
                <div className="flex flex-wrap justify-center">
                    <div className="p-4 w-full">
                        <h1 className="text-4xl font-semibold text-white">
                            "Patience, the Best Stories Are Worth the Wait."
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
        !isLoading && (
            <div className="w-full bg-gradient-to-b from-black via-purple-950 to-black py-12">
                <div className="text-center mb-8">
                    <h2 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
                        "Discover the Unseen, Explore the Unknown."
                    </h2>
                    <p className="text-xl text-gray-300 mt-4">
                        From the latest movie reviews to insightful blogs, uncover content you’ve never seen before.
                    </p>
                </div>
                <div className="ml-[2rem] h-full flex flex-wrap sm:justify-start justify-center items-center gap-4 transition-all duration-500">
                    {posts?.map((post) => (
                        <div
                            key={post._id}
                            className="p-4 w-full sm:w-[18rem] lg:w-[20rem] xl:w-[22rem] transition-transform transform hover:scale-105 animate__animated animate__fadeIn animate__delay-1s"
                        >
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </div>
        )
    );
}

export default HomePage;

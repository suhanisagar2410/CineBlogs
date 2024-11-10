import {useEffect, useState} from 'react'
import postServices from '../AppWrite/CreatePost'
import { PostCard} from '../Components'
import { useSelector } from 'react-redux'
import { ScaleLoader } from "react-spinners";
import { getAllPosts } from '../AppWrite/Apibase';
function HomePage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setLoading] = useState(false)

    const getPosts = async ()=>{
        const authToken = localStorage.getItem("authToken")
        const posts = await getAllPosts(authToken)
        if (posts) {
          setPosts(posts);
        }
    }
    useEffect(() => {
        getPosts()
      }, []);
    useEffect(() => {
        getPosts()
      }, []);
    const userStatus = useSelector((state) => state.Auth.status)
  
    if (posts.length === 0 && userStatus!== true)  {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold text-white">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </>
            </div>
        )
    }


    if(posts.length === 0 && userStatus === true && isLoading){
        return   <div className="w-full py-8 mt-4 text-center">
        <>
        <div className="flex items-center justify-center">
            <div className="mt-[10rem]">
            <ScaleLoader color='#ffffff' height={50} />
        </div>
          </div>
            <div className="flex flex-wrap">
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
        !isLoading &&
        <div className='w-full bg-black py-8'>
            <>
                <div className='ml-2 h-full flex flex-wrap sm:justify-start justify-center items-center'>
                    {posts?.map((post) => (
                        <div key={post._id} className='p-2 '>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </>
        </div>
    )
}

export default HomePage;
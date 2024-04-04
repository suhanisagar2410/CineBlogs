import React, {useEffect, useState} from 'react'
import postServices from '../AppWrite/CreatePost'
import { PostCard} from '../Components'
import { useSelector } from 'react-redux'

function HomePage() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        postServices.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])

    const userStatus = useSelector((state) => state.Auth.status)
  
    if (posts.length === 0 && userStatus !== true)  {
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

    if(posts.length === 0 && userStatus == true){
        return   <div className="w-full py-8 mt-4 text-center">
        <>
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
        <div className='w-full py-8'>
            <>
                <div className='flex flex-wrap justify-center items-center'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 '>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </>
        </div>
    )
}

export default HomePage;